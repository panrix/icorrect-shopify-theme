/**
 * iCorrect - Shopify Contact Form → n8n Interceptor
 * Version: 2.0 (Production)
 * 
 * This script intercepts Shopify contact form submissions and routes them
 * through n8n to create properly structured Intercom conversations.
 * 
 * Installation:
 * 1. Add this file to your Shopify theme assets
 * 2. Include in theme.liquid before </body>:
 *    {{ 'contact-form-interceptor.js' | asset_url | script_tag }}
 */

(function() {
  'use strict';

  const CONFIG = {
    webhookUrl: 'https://icorrect.app.n8n.cloud/webhook/shopify-contact-form',
    formSelector: 'form[data-contact-intercept="true"]',
    debug: false
  };

  const SUPPORT_EMAIL = 'support@icorrect.co.uk';
  const FALLBACK_MESSAGE = 'We could not reach our live contact system. Your message will now be sent through our standard contact form.';

  const log = (message, data = null) => {
    if (!CONFIG.debug) return;
    if (data) {
      console.log(`[iCorrect Form] ${message}`, data);
      return;
    }
    console.log(`[iCorrect Form] ${message}`);
  };

  function initFormInterceptor() {
    document.querySelectorAll(CONFIG.formSelector).forEach((form) => {
      if (form.dataset.n8nIntercepted === 'true') return;

      form.dataset.n8nIntercepted = 'true';
      form.addEventListener('submit', handleFormSubmit);
      log('Form intercepted', {
        id: form.id || null,
        action: form.getAttribute('action') || form.action || null
      });
    });
  }

  async function handleFormSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    if (form.dataset.nativeFallbackSubmit === 'true') {
      delete form.dataset.nativeFallbackSubmit;
      return;
    }

    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.innerHTML : '';

    try {
      setLoadingState(submitButton);
      ensureSpinnerStyle();
      clearFormBanner(form);

      const formData = collectFormData(form);
      validateFormData(formData);

      const response = await sendToN8N(formData);
      log('Response received', response);

      if (!response.success) {
        throw createRecoverableError(response.error || 'Failed to submit form');
      }

      showSuccessMessage(form);

      if (typeof gtag === 'function') {
        gtag('event', 'form_submission', {
          event_category: 'Contact Form',
          event_label: formData.company ? 'Corporate' : 'Consumer'
        });
      }
    } catch (error) {
      console.error('[iCorrect Form] Submission error:', error);

      if (error.recoverable) {
        showErrorMessage(form, FALLBACK_MESSAGE);
        submitViaShopify(form, submitButton);
        return;
      }

      showErrorMessage(form, error.message || 'Unable to submit form');
      restoreButtonState(submitButton, originalButtonText);
    }
  }

  function setLoadingState(submitButton) {
    if (!submitButton) return;

    submitButton.disabled = true;
    submitButton.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><svg width="16" height="16" viewBox="0 0 24 24" style="animation:spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round"/></svg>Sending...</span>';
    submitButton.style.opacity = '0.8';
  }

  function restoreButtonState(submitButton, originalButtonText) {
    if (!submitButton) return;

    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
    submitButton.style.opacity = '1';
  }

  function ensureSpinnerStyle() {
    if (document.getElementById('n8n-spinner-style')) return;

    const style = document.createElement('style');
    style.id = 'n8n-spinner-style';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } } @keyframes contactFormSlideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }';
    document.head.appendChild(style);
  }

  function collectFormData(form) {
    const data = {};
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      if (['authenticity_token', 'form_type', 'utf8'].includes(key)) {
        continue;
      }

      const match = key.match(/contact\[(.+)\]/);
      if (match) {
        data[match[1]] = value;
      } else {
        data[key] = value;
      }
    }

    return data;
  }

  function validateFormData(data) {
    if (!data.name || !data.name.trim()) {
      throw new Error('Please enter your name');
    }

    if (!data.email || !data.email.trim()) {
      throw new Error('Please enter your email address');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      throw new Error('Please enter a valid email address');
    }
  }

  async function sendToN8N(formData) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          contact: formData,
          timestamp: new Date().toISOString(),
          source: 'shopify-website',
          page_url: window.location.href,
          referrer: document.referrer || null
        }),
        signal: controller.signal
      });

      const contentType = response.headers.get('content-type') || '';

      if (response.ok) {
        if (!contentType.includes('application/json')) {
          throw createRecoverableError('Contact webhook returned a non-JSON success response.');
        }

        try {
          return await response.json();
        } catch (error) {
          throw createRecoverableError('Contact webhook returned invalid JSON.');
        }
      }

      let errorMessage = 'Unable to submit form';
      if (contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      }

      throw createRecoverableError(errorMessage);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw createRecoverableError('Request timed out. Please try again.');
      }

      if (error.recoverable) {
        throw error;
      }

      throw createRecoverableError(error.message || 'Unable to submit form');
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function createRecoverableError(message) {
    const error = new Error(message);
    error.recoverable = true;
    return error;
  }

  function submitViaShopify(form, submitButton) {
    if (submitButton) {
      submitButton.innerHTML = 'Retrying via standard form...';
    }

    form.dataset.nativeFallbackSubmit = 'true';
    window.setTimeout(() => {
      // Intentionally bypass this interceptor so native Shopify form handling can take over.
      HTMLFormElement.prototype.submit.call(form);
    }, 150);
  }

  function showSuccessMessage(form) {
    form.style.transition = 'opacity 0.3s ease';
    form.style.opacity = '0';

    setTimeout(() => {
      form.style.display = 'none';

      const successDiv = document.createElement('div');
      successDiv.className = 'contact-success-message';
      successDiv.style.cssText = 'opacity: 0; transition: opacity 0.3s ease;';
      successDiv.innerHTML = `
        <div style="text-align: center; padding: 48px 24px;">
          <div style="width: 72px; height: 72px; margin: 0 auto 24px; background: linear-gradient(135deg, #e6fcf5 0%, #c3fae8 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(12, 166, 120, 0.15);">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0ca678" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 12px; color: #1a1a1a;">Message Sent!</h2>
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 8px; line-height: 1.6;">Thank you for your enquiry.</p>
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 24px; line-height: 1.6;">We'll get back to you as soon as possible.</p>
          <a href="/" style="display: inline-block; padding: 14px 28px; background: #1f2937; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.2s;">Back to Home</a>
        </div>
      `;

      form.parentNode.insertBefore(successDiv, form);

      requestAnimationFrame(() => {
        successDiv.style.opacity = '1';
      });

      successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  function clearFormBanner(form) {
    const existingBanner = form.querySelector('.contact-error-banner');
    if (existingBanner) {
      existingBanner.remove();
    }
  }

  function showErrorMessage(form, message) {
    clearFormBanner(form);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'contact-error-banner';
    errorDiv.style.cssText = [
      'padding: 16px 20px',
      'background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      'border: 1px solid #fecaca',
      'border-radius: 12px',
      'margin-bottom: 24px',
      'animation: contactFormSlideIn 0.3s ease'
    ].join(';');

    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:flex-start;gap:12px;';

    const iconWrap = document.createElement('div');
    iconWrap.style.cssText = 'flex-shrink:0;width:24px;height:24px;background:#fecaca;border-radius:50%;display:flex;align-items:center;justify-content:center;';
    iconWrap.setAttribute('aria-hidden', 'true');
    iconWrap.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    const copyWrap = document.createElement('div');

    const title = document.createElement('p');
    title.style.cssText = 'margin:0 0 4px 0;font-weight:600;color:#991b1b;';
    title.textContent = 'Unable to send message';

    const detail = document.createElement('p');
    detail.style.cssText = 'margin:0;font-size:14px;color:#b91c1c;';
    detail.textContent = message;

    const support = document.createElement('p');
    support.style.cssText = 'margin:8px 0 0 0;font-size:13px;color:#7f1d1d;';
    support.appendChild(document.createTextNode('You can also reach us at '));

    const supportLink = document.createElement('a');
    supportLink.href = `mailto:${SUPPORT_EMAIL}`;
    supportLink.style.cssText = 'color:#b91c1c;font-weight:500;';
    supportLink.textContent = SUPPORT_EMAIL;
    support.appendChild(supportLink);

    copyWrap.appendChild(title);
    copyWrap.appendChild(detail);
    copyWrap.appendChild(support);

    row.appendChild(iconWrap);
    row.appendChild(copyWrap);
    errorDiv.appendChild(row);

    form.insertBefore(errorDiv, form.firstChild);
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormInterceptor);
  } else {
    initFormInterceptor();
  }

  document.addEventListener('shopify:section:load', () => {
    window.setTimeout(initFormInterceptor, 100);
  });

  const observer = new MutationObserver((mutations) => {
    const shouldCheck = mutations.some((mutation) => mutation.addedNodes.length > 0);
    if (shouldCheck) {
      window.setTimeout(initFormInterceptor, 50);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  if (CONFIG.debug) {
    window.__n8nFormInterceptor = {
      config: CONFIG,
      reinit: initFormInterceptor
    };
  }
})();
