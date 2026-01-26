if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        this.variantIdInput.disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        this.submitButtonText = this.submitButton.querySelector('span');

        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

        this.hideErrors = this.dataset.hideErrors === 'true';
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        this.handleErrorMessage();

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');


        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
             var spinnerElement = document.querySelector('.custom-add-to-cart .button .loading__spinner'); 
            if (spinnerElement) {
                spinnerElement.classList.remove('hidden'); 
            }
            if (response.status) {
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });
              this.handleErrorMessage(response.description);

              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButtonText.classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }

            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                cartData: response,
              });
            this.error = false;
         
            /*const quickAddModal = this.closest('quick-add-modal');
            if (quickAddModal) {
    
              document.body.addEventListener(
                'modalClosed',
                () => {
                  setTimeout(() => {
                    this.cart.renderContents(response);
                  });
                },
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              
              this.cart.renderContents(response);
            }*/
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {

             const bookNowBtn = document.querySelector('.custom-add-to-cart button');
            var divElement = document.querySelector('.collect-device-btn'); // Replace 'your-class-name' with the actual class
            bookNowBtn.disabled = true;
            
              if (divElement) {
                   var hasActiveClass = divElement.classList.contains('active');
               
                  if(hasActiveClass){
                    const londonCourierPrice = document.getElementById("london-courier-price");
                    const nationalCourierPrice = document.getElementById("national-courier-price");
                    // const stuartCost = document.querySelector(".delivery-price");
                    console.log(londonCourierPrice);
                    console.log(nationalCourierPrice);
                    let scost = 0;

                    if(londonCourierPrice){
                      scost = londonCourierPrice.textContent;
                      console.log(scost);
                    } else {
                      scost = nationalCourierPrice.textContent;
                      console.log(scost);
                    }

                    const hiddenInput = document.querySelector('input[name="double"]');

                      if (hiddenInput && hiddenInput.value === "true") {
                          if(scost){
                             scost = parseFloat(scost)*2;
                          }
                      }
                   

                    
                    //console.log(scost);

                    fetch("/apps/icorrect/data", {
                        method: "post",
                        body: JSON.stringify({ shippingCost: scost }),
                        headers: {
                          "Content-type": "application/json",
                        },
                      })
                        .then((response) => {
                          if (!response.ok) throw new Error("Network response was not OK");
                          return response.json();
                        })
                        .then((response) => {
                          const variantId = response.split('/').pop();
                          
                          let formData = {
                            'items': [{
                                'id': variantId,
                                'quantity': 1,
                              'properties' : {
                                'shipping': true
                              }
                            }]
                          };
          
                        fetch('https://i-correct-final.myshopify.com/cart/add.js', {
                           method: 'POST',
                           headers: {
                              'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(formData)
                          })
                          .then(response => {
                              return response.json(); // Assuming the response is in JSON format
                          })
                          .then(data => {
                            var spinnerElement = document.querySelector('.custom-add-to-cart .button .loading__spinner'); 
                            if (spinnerElement) {
                                spinnerElement.classList.add('hidden'); 
                            }
                          window.location.href = '/checkout';
                          bookNowBtn.disabled = false;
                          this.submitButton.classList.remove('loading');
                          if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
                          if (!this.error) this.submitButton.removeAttribute('aria-disabled');
                          this.querySelector('.loading__spinner').classList.add('hidden');
                        })
                        .catch(error => {
                          console.error('Error:', error);
                          bookNowBtn.disabled = false;
                        });
                      });
                  }else{
                    this.submitButton.classList.remove('loading');
                    if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
                    if (!this.error) this.submitButton.removeAttribute('aria-disabled');
                    this.querySelector('.loading__spinner').classList.add('hidden');
                    var spinnerElement = document.querySelector('.custom-add-to-cart .button .loading__spinner'); 
                    if (spinnerElement) {
                        spinnerElement.classList.add('hidden'); 
                    }
                    window.location.href = '/checkout';
                    bookNowBtn.disabled = false;
                  }
              }
            
            
            
            
          });
      }

      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }

      toggleSubmitButton(disable = true, text) {
        if (disable) {
          this.submitButton.setAttribute('disabled', 'disabled');
          if (text) this.submitButtonText.textContent = text;
        } else {
          this.submitButton.removeAttribute('disabled');
          this.submitButtonText.textContent = window.variantStrings.addToCart;
        }
      }

      get variantIdInput() {
        return this.form.querySelector('[name=id]');
      }
    }
  );
}
