class Excelect extends HTMLElement {
  constructor() {
    super();

    const KEYS = {
      ENTER: 13,
      UP: 38,
      DOWN: 40,
    };

    this.reset();
    this.stamp = `x-select-${Date.now()}`;
    this.placeholder = this.getAttribute('placeholder');
    this.select = this.querySelector('select');

    const div = document.createElement('div');
    div.style.position = 'relative';
    div.innerHTML = '<style>li.is-active,li:hover {background-color:#eee;cursor:pointer;}</style>';

    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = this.placeholder;
    this.input = input;

    const ul = document.createElement('ul');

    ul.id = this.stamp;
    ul.style.position = 'absolute';
    ul.style.border = '1px solid lightgray';
    ul.style.overflow = 'scroll';
    ul.style.listStyle = 'none';
    ul.style.padding = '0';

    div.appendChild(input);
    this.appendChild(div);

    const options = this.select.querySelectorAll('option');
    const arr = Array.from(options).map(c => c.textContent);

    input.addEventListener('input', (e) => {
      this.reset();

      if (e.target.value === '') {
        div.removeChild(ul);
        return;
      }

      this.suggest = arr.filter(val => val.indexOf(e.target.value) > -1);

      this.closeSuggest = () => {
        div.removeChild(ul);
        this.showSuggest = false;
      };

      if (this.suggest.length > 0) {
        this.max = this.suggest.length;
        const fragment = document.createDocumentFragment();

        this.suggest.forEach((val, i) => {
          const li = document.createElement('li');
          this.items.push(li);
          li.textContent = val;
          li.addEventListener('click', () => {
            this.current = i + 1;
            this.activeCurrent();
            this.closeSuggest();
          }, false);
          fragment.appendChild(li);
        });

        while (ul.firstChild) ul.removeChild(ul.firstChild);
        ul.appendChild(fragment);
        div.appendChild(ul);

        this.showSuggest = true;
      } else {
        if (this.showSuggest) {
          this.closeSuggest();
        }
      }
    }, false);

    input.addEventListener('keydown', (e) => {
      if (e.keyCode === KEYS.UP) {
        e.preventDefault();
        if (this.current > 1) {
          this.current = this.current - 1;
        }

        this.activeCurrent();
      } else if (e.keyCode === KEYS.DOWN) {
        e.preventDefault();
        if (this.current < this.max) {
          this.current = this.current + 1;
        }

        this.activeCurrent();
      }
    }, false);
  }

  reset() {
    this.current = 0;
    this.max = 0;
    this.items = [];
    this.suggest = [];
  }

  closeSuggest() {
    this.reset();
  }

  activeCurrent() {
    if (this.current === 0) return;
    const val = this.select.querySelectorAll('option')[this.current - 1].value;
    this.select.value = val;
    this.input.value = this.suggest[this.current - 1];

    this.items.forEach((item, i) => {
      if (i === (this.current - 1)) {
        this.items[i].classList.add('is-active');
      } else {
        this.items[i].classList.remove('is-active');
      }
    });
  }
}

customElements.define('x-select', Excelect);
