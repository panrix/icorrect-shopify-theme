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

  // ============================================
  // CONFIGURATION
  // ============================================
  
  const CONFIG = {
    // n8n webhook URL - UPDATE THIS
    webhookUrl: 'https://icorrect.app.n8n.cloud/webhook/shopify-contact-form',
    
    // Form selectors to intercept
    formSelectors: [
      '#ContactForm',           // Consumer contact form
      '#corporate-lead-form'    // Corporate landing page form
    ],
    
    // Debug mode - set to false in production
    debug: false
  };

  // ============================================
  // LOGGING
  // ============================================

  const log = (message, data = null) => {
    if (!CONFIG.debug) return;
    if (data) {
      console.log(`[iCorrect Form] ${message}`, data);
    } else {
      console.log(`[iCorrect Form] ${message}`);
    }
  };

  // ============================================
  // FORM HANDLER
  // ============================================

  function initFormInterceptor() {
    CONFIG.formSelectors.forEach(selector => {
      const form = document.querySelector(selector);
      if (form && !form.dataset.n8nIntercepted) {
        form.dataset.n8nIntercepted = 'true';
        
        // Disable Shopify's default form action
        form.setAttribute('action', 'javascript:void(0);');
        form.setAttribute('data-original-action', form.action || '');
        
        // Attach our handler with capture to ensure we run first
        form.addEventListener('submit', handleFormSubmit, { capture: true });
        
        log('Form intercepted:', selector);
      }
    });
  }

  async function handleFormSubmit(e) {
    // Prevent ALL default behaviour
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.innerHTML : '';
    
    try {
      // Show loading state
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><svg width="16" height="16" viewBox="0 0 24 24" style="animation:spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round"/></svg>Sending...</span>';
        submitButton.style.opacity = '0.8';
      }

      // Add spinner animation if not exists
      if (!document.getElementById('n8n-spinner-style')) {
        const style = document.createElement('style');
        style.id = 'n8n-spinner-style';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }

      // Collect and validate form data
      const formData = collectFormData(form);
      log('Form data collected:', formData);
      
      // Validate required fields
      validateFormData(formData);
      
      // Send to n8n webhook
      const response = await sendToN8N(formData);
      log('Response received:', response);
      
      if (response.success) {
        showSuccessMessage(form);
        
        // Track successful submission (if analytics available)
        if (typeof gtag === 'function') {
          gtag('event', 'form_submission', {
            'event_category': 'Contact Form',
            'event_label': formData.company ? 'Corporate' : 'Consumer'
          });
        }
      } else {
        throw new Error(response.error || 'Failed to submit form');
      }
      
    } catch (error) {
      console.error('[iCorrect Form] Submission error:', error);
      showErrorMessage(form, error.message);
      
      // Restore button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        submitButton.style.opacity = '1';
      }
    }
    
    return false;
  }

  function collectFormData(form) {
    const data = {};
    const formData = new FormData(form);
    
    for (let [key, value] of formData.entries()) {
      // Skip Shopify system fields
      if (['authenticity_token', 'form_type', 'utf8'].includes(key)) {
        continue;
      }
      
      // Extract field name from contact[fieldname] format
      const match = key.match(/contact\[(\w+)\]/);
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
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      throw new Error('Please enter a valid email address');
    }
  }

  async function sendToN8N(formData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
    
    try {
      const response = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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

      clearTimeout(timeoutId);

      // Handle different response types
      const contentType = response.headers.get('content-type');
      
      if (response.ok) {
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        return { success: true };
      }
      
      // Handle error responses
      let errorMessage = 'Unable to submit form';
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      }
      
      throw new Error(errorMessage);
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      
      throw error;
    }
  }

  function showSuccessMessage(form) {
    // Hide the form with animation
    form.style.transition = 'opacity 0.3s ease';
    form.style.opacity = '0';
    
    setTimeout(() => {
      form.style.display = 'none';
      
      // Create success message
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
      
      // Fade in
      requestAnimationFrame(() => {
        successDiv.style.opacity = '1';
      });
      
      // Scroll to success message
      successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  function showErrorMessage(form, message) {
    // Remove existing error
    const existingError = form.querySelector('.contact-error-banner');
    if (existingError) {
      existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'contact-error-banner';
    errorDiv.style.cssText = `
      padding: 16px 20px;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border: 1px solid #fecaca;
      border-radius: 12px;
      margin-bottom: 24px;
      animation: slideIn 0.3s ease;
    `;
    errorDiv.innerHTML = `
      <style>
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="flex-shrink: 0; width: 24px; height: 24px; background: #fecaca; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <div>
          <p style="margin: 0 0 4px 0; font-weight: 600; color: #991b1b;">Unable to send message</p>
          <p style="margin: 0; font-size: 14px; color: #b91c1c;">${message}</p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #7f1d1d;">
            You can also reach us at <a href="mailto:support@icorrect.co.uk" style="color: #b91c1c; font-weight: 500;">support@icorrect.co.uk</a>
          </p>
        </div>
      </div>
    `;
    
    form.insertBefore(errorDiv, form.firstChild);
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormInterceptor);
  } else {
    initFormInterceptor();
  }

  // Handle Shopify section reloads (theme editor)
  document.addEventListener('shopify:section:load', () => {
    setTimeout(initFormInterceptor, 100);
  });

  // Watch for dynamically added forms
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) shouldCheck = true;
    });
    if (shouldCheck) {
      setTimeout(initFormInterceptor, 50);
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });

  // Expose for debugging (only in debug mode)
  if (CONFIG.debug) {
    window.__n8nFormInterceptor = {
      config: CONFIG,
      reinit: initFormInterceptor
    };
  }

})();