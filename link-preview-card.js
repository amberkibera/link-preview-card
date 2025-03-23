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
        border-radius: 8px;
        padding: 10px;
        max-width: 400px;
        border: 2px solid var(--themeColor);
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
  margin: 0 auto;
  border-radius: 12px;
  border: 3px solid var(--themeColor);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
       }

      .content {
  margin-top: 14px;
  padding: 0 12px;
       }

      .title {
  font-weight: 700;
  font-size: 1.3rem;
  margin: 16px 0;
  color: var(--themeColor);
  text-transform: uppercase;
       }

      details {
  border: 2px solid var(--themeColor);
  border-radius: 10px;
  text-align: center;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  height: auto;
  overflow: hidden;
       }

      details summary {
  font-size: 18px;
  padding: 10px 0;
  cursor: pointer;
  font-weight: 600;
       }

      .desc {
  font-size: 1rem;
  color: white;
  margin: 12px 0;
       }

      .url {
  display: inline-block;
  padding: 10px 14px;
  margin: 10px auto;
  font-weight: bold;
  font-size: 1rem;
  color: #fff;
  border: 2px solid var(--themeColor);
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  background-color: transparent;
       }

      .url:hover {
  background-color: var(--themeColor);
  color: #000;
  transform: scale(1.05);
       }

      .loading-spinner {
  margin: 24px auto;
  border: 4px solid #ddd;
  border-top: 4px solid var(--themeColor);
  border-radius: 50%;
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
    padding: 12px;
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