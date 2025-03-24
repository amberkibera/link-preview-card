/**
 * Copyright 2025 amberkibera
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview-card`
 * 
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.href = "";
    this.description = "";
    this.image = "";
    this.link = "";
    this.themeColor = "";
    this.loadingState = false;

    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      href: { type: String },
      description: { type: String },
      image: { type: String },
      link: { type: String },
      themeColor: { type: String },
      loadingState: { type: Boolean, reflect: true, attribute: "loading-state" },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
        border-radius: --ddd-radius-sm;
        padding: --ddd-spacing-3;
        max-width: --ddd-border-sm;
        border: --ddd-border-sm;
      }
      :host(:hover) {
  transform: translateY(-8px);
       }

      .preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
       }

      img {
  display: block;
  max-width: 85%;
  height: auto;
  margin:  var(--ddd-spacing-0) auto;
  border-radius: --ddd-radius-md;
  border: --ddd-border-md;
  box-shadow: --ddd-boxShadow-sm;
       }

      .content {
  margin-top: --ddd-spacing-4;
  padding: 0 var(--ddd-spacing-3);
       }

      .title {
  font-weight: --ddd-font-size-bold;
  font-size: var(--ddd-font-size-md);
  margin: var(--ddd-spacing-4) 0;
  color: var(--ddd-color-primary);
  text-transform: uppercase;
       }

      details {
  border:--ddd-border-sm;
  border-radius: --ddd-radius-md;
  text-align: center;
  padding: --ddd-spacing-3;
  background-color: var(--ddd-color-primary);
  height: auto;
  overflow: hidden;
       }

      details summary {
  font-size:--ddd-font-size-3xs;
  padding: var(--ddd-spacing-3) 0;
  cursor: pointer;
  font-weight:--ddd-font-size-bold;
       }

      .desc {
  font-size: var(--ddd-font-size-base);
  color: --ddd-theme-default-white;
  margin:var(--ddd-spacing-3) 0;
       }

      .url {
  display: inline-block;
  padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
  margin: var(--ddd-spacing-3) auto;
  font-weight:--ddd-font-weight-bold;
  font-size: var(--ddd-font-size-base);
  color:var(--ddd-color-white);
  border: --ddd-border-sm;
  border-radius: --ddd-radius-md;
  transition: all 0.3s ease-in-out;
  background-color:--ddd-theme-default-potential0;
       }

      .url:hover {
  background-color: var(--ddd-color-primary);
  color:  var(--ddd-color-black);
  transform: scale(1.05);
       }

      .loading-spinner {
  margin: var(--ddd-spacing-5) auto;
  border: 4px solid #ddd;
  border-top: --ddd-border-lg;
  border-radius: var(--ddd-border-radius-circle);
  width: 32px;
  height: 32px;
  animation: spin 1.5s linear infinite;
       }

      @keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
      }

      @media (max-width: 600px) {
  :host {
    max-width: 100%;
    padding: --ddd-spacing-3;
       }
     }
  `];
  }
   handleClick() {
    let inputValue = this.shadowRoot.querySelector("#textInput").value;
    this.fetchData(inputValue);
  }

  // Lit render the HTML
  render() {
    return html`
      <input type="text" id="textInput" placeholder="Enter text here">
      <button @click="${this.handleClick}">Submit</button>
      <div class="preview" style="--themeColor: ${this.themeColor}" part="preview">
        ${this.loadingState
          ? html`<div class="loading-spinner" part="loading-spinner"></div>`
          : html`
            ${this.image ? html`<img src="${this.image}" alt="" @error="${this.handleImageError}" part="image" />` : ''}
            <div class="content" part="content">
              <h3 class="title" part="title">${this.title}</h3>
              <details part="details">
                <summary part="summary">Description</summary>
                <p class="desc" part="desc">${this.description}</p>
              </details>
              <a href="${this.link}" target="_blank" class="url" part="url">Visit Site</a>
            </div>
        `}
      </div>
    `;
  }

  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
  }
  // life cycle will run when anything defined in `properties` is modified
  updated(changedProperties) {
    // see if value changes from user input and is not empty
    if (changedProperties.has("href") && this.href) {
      this.fetchData(this.href);
    }
  }

  async fetchData(link) {
    this.loadingState = true;
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      }
      
      const json = await response.json();

      this.title = json.data["og:title"] || json.data["title"] || "No Title Available";
      this.description = json.data["description"] || "No Description Available";
      this.image = json.data["image"] || json.data["logo"] || json.data["og:image"] || "";
      this.link = json.data["url"] || link;
      this.themeColor = json.data["theme-color"] || this.defaultTheme();
    } catch (error) {
      console.error("Error fetching metadata:", error);
      this.title = "No Preview Available";
      this.description = "";
      this.image = "";
      this.link = "";
      this.themeColor = this.defaultTheme();
    } finally {
      this.loadingState = false;
    }
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);