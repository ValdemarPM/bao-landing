// Language functionality
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = {};
        this.supportedLanguages = {
            'en': 'English',
            'es': 'Español',
            'pt': 'Português'
        };
        this.init();
    }

    init() {
        this.loadTranslations();
        this.createLanguageSelector();
        this.applyTranslations();
        this.updateLanguageSelector();
    }

    loadTranslations() {
        // Use the embedded translations from translations.js
        if (typeof translations !== 'undefined' && translations[this.currentLang]) {
            this.translations = translations[this.currentLang];
        } else {
            // Fallback to English if translation not found
            this.currentLang = 'en';
            this.translations = translations['en'];
        }
    }

    createLanguageSelector() {
        // Find the theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Check if selector already exists
        if (document.getElementById('languageSelector')) return;

        // Create language selector container
        const langSelectorContainer = document.createElement('div');
        langSelectorContainer.className = 'language-selector-container';

        // Create the language selector
        const langSelector = document.createElement('select');
        langSelector.id = 'languageSelector';
        langSelector.className = 'language-selector';
        langSelector.setAttribute('aria-label', 'Select language');

        // Add options for each supported language
        Object.keys(this.supportedLanguages).forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = this.supportedLanguages[lang];
            if (lang === this.currentLang) {
                option.selected = true;
            }
            langSelector.appendChild(option);
        });

        // Add change event listener
        langSelector.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        langSelectorContainer.appendChild(langSelector);

        // Insert before theme toggle
        themeToggle.parentNode.insertBefore(langSelectorContainer, themeToggle);
    }

    updateLanguageSelector() {
        const selector = document.getElementById('languageSelector');
        if (selector) {
            selector.value = this.currentLang;
        }
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
    }

    changeLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.loadTranslations();
        this.applyTranslations();
        this.updateLanguageSelector();
    }

    applyTranslations() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach((link, index) => {
            const keys = ['features', 'howItWorks', 'support'];
            if (this.translations.nav && this.translations.nav[keys[index]]) {
                link.textContent = this.translations.nav[keys[index]];
            }
        });

        // Install buttons - more specific targeting
        document.querySelectorAll('.btn-primary').forEach(button => {
            const buttonText = button.textContent.trim();
            if (buttonText.includes('Install') || buttonText.includes('Instalar') ||
                buttonText === 'Install Now!' || buttonText === '¡Instalar ahora!') {
                button.textContent = this.translations.nav?.installNow || button.textContent;
            }
        });

        // Hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && this.translations.hero?.title) {
            heroTitle.textContent = this.translations.hero.title;
        }

        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && this.translations.hero?.subtitle) {
            heroSubtitle.textContent = this.translations.hero.subtitle;
        }

        // Features section
        const featuresTitle = document.querySelector('#features .section-title');
        if (featuresTitle && this.translations.features?.title) {
            featuresTitle.textContent = this.translations.features.title;
        }

        // Feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            const titleElement = card.querySelector('.feature-title');
            const descElement = card.querySelector('.feature-description');

            if (this.translations.features?.items?.[index]) {
                if (titleElement) {
                    titleElement.textContent = this.translations.features.items[index].title;
                }
                if (descElement) {
                    descElement.textContent = this.translations.features.items[index].description;
                }
            }
        });

        // Showcase slides
        const showcaseSlides = document.querySelectorAll('.showcase-slide');
        showcaseSlides.forEach((slide, index) => {
            const titleElement = slide.querySelector('.showcase-content h3');
            const descElement = slide.querySelector('.showcase-content p');
            const learnMoreBtn = slide.querySelector('.btn-secondary');

            if (this.translations.features?.showcase?.[index]) {
                if (titleElement) {
                    titleElement.textContent = this.translations.features.showcase[index].title;
                }
                if (descElement) {
                    descElement.textContent = this.translations.features.showcase[index].description;
                }
                if (learnMoreBtn) {
                    learnMoreBtn.textContent = this.translations.features.showcase[index].learnMore;
                }
            }
        });

        // Value propositions
        const valueProps = document.querySelectorAll('.value-prop');
        valueProps.forEach((prop, index) => {
            const titleElement = prop.querySelector('.value-prop-title');
            const textElement = prop.querySelector('.value-prop-text');

            if (this.translations.features?.valueProps?.[index]) {
                if (titleElement) {
                    titleElement.textContent = this.translations.features.valueProps[index].title;
                }
                if (textElement) {
                    textElement.textContent = this.translations.features.valueProps[index].text;
                }
            }
        });

        // How it works section
        const howItWorksTitle = document.querySelector('#how-it-works .section-title');
        if (howItWorksTitle && this.translations.howItWorks?.title) {
            howItWorksTitle.textContent = this.translations.howItWorks.title;
        }

        const howItWorksSubtitle = document.querySelector('#how-it-works .subsection-title');
        if (howItWorksSubtitle && this.translations.howItWorks?.subtitle) {
            howItWorksSubtitle.textContent = this.translations.howItWorks.subtitle;
        }

        // Steps
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            const titleElement = step.querySelector('.step-content h4');
            const descElement = step.querySelector('.step-content p');

            if (this.translations.howItWorks?.steps?.[index]) {
                if (titleElement) {
                    titleElement.textContent = this.translations.howItWorks.steps[index].title;
                }
                if (descElement) {
                    if (index === 3 && this.translations.howItWorks.steps[index].descriptionStrong) {
                        descElement.innerHTML = `<strong>${this.translations.howItWorks.steps[index].descriptionStrong}</strong><br>${this.translations.howItWorks.steps[index].description}`;
                    } else {
                        descElement.textContent = this.translations.howItWorks.steps[index].description;
                    }
                }
            }
        });

        // Integration section
        const integrationTitle = document.querySelector('.integration h2');
        if (integrationTitle && this.translations.integration?.title) {
            integrationTitle.textContent = this.translations.integration.title;
        }

        const integrationDesc = document.querySelector('.integration-text p');
        if (integrationDesc && this.translations.integration?.description) {
            integrationDesc.textContent = this.translations.integration.description;
        }

        const integrationBtn = document.querySelector('.integration .btn-primary');
        if (integrationBtn && this.translations.integration?.button) {
            integrationBtn.textContent = this.translations.integration.button;
        }

        // Support section
        const supportTitle = document.querySelector('#support .section-title');
        if (supportTitle && this.translations.support?.title) {
            supportTitle.textContent = this.translations.support.title;
        }

        // Documentation card
        const docCard = document.querySelector('.support-card:first-child');
        if (docCard && this.translations.support?.documentation) {
            const cardTitle = docCard.querySelector('.support-card-title');
            const subtitle = docCard.querySelector('h4');
            const desc = docCard.querySelector('p');
            const btn = docCard.querySelector('.btn-primary');

            if (cardTitle) cardTitle.textContent = this.translations.support.documentation.title;
            if (subtitle) subtitle.textContent = this.translations.support.documentation.subtitle;
            if (desc) desc.textContent = this.translations.support.documentation.description;
            if (btn) btn.textContent = this.translations.support.documentation.button;
        }

        // Help card
        const helpCard = document.querySelector('.support-card:last-child');
        if (helpCard && this.translations.support?.help) {
            const cardTitle = helpCard.querySelector('.support-card-title');
            const subtitle = helpCard.querySelector('h4');
            const desc = helpCard.querySelector('p');
            const btn = helpCard.querySelector('.btn-primary');

            if (cardTitle) cardTitle.textContent = this.translations.support.help.title;
            if (subtitle) subtitle.textContent = this.translations.support.help.subtitle;
            if (desc) desc.textContent = this.translations.support.help.description;
            if (btn) btn.textContent = this.translations.support.help.button;
        }

        // Footer
        const copyright = document.querySelector('.footer-copyright');
        if (copyright && this.translations.footer?.copyright) {
            copyright.textContent = this.translations.footer.copyright;
        }

        // Update theme toggle label based on current theme
        this.updateThemeLabelTranslation();
    }

    updateThemeLabelTranslation() {
        const themeLabel = document.querySelector('.theme-label');
        if (themeLabel && this.translations.footer) {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            themeLabel.textContent = currentTheme === 'dark'
                ? this.translations.footer.lightMode
                : this.translations.footer.darkMode;
        }
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.languageManager = new LanguageManager();
});

// Update theme toggle to use translations
const originalUpdateThemeToggleText = window.updateThemeToggleText;
window.updateThemeToggleText = function (theme) {
    if (window.languageManager) {
        window.languageManager.updateThemeLabelTranslation();
    } else {
        originalUpdateThemeToggleText(theme);
    }
};