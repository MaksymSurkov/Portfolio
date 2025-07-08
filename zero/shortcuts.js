const shortcutGroups = [
  {
    title: 'No Modifiers',
    items: [
      { key: 'F1', desc: 'F1' },
      { key: 'F2', desc: 'F2' },
      { key: 'F3', desc: 'F3' },
      { key: 'F4', desc: 'F4' },
      { key: 'F5', desc: 'F5' },
      { key: 'F6', desc: 'ANS' },
      { key: 'F9', desc: '2ND' },
      { key: 'F10', desc: 'ALPHA' },
      { key: 'F12', desc: 'ON' },
      { key: 'Enter', desc: 'ENTER' },
      { key: '↑', desc: 'eKEY_UP' },
      { key: '↓', desc: 'eKEY_DOWN' },
      { key: '←', desc: 'eKEY_LEFT' },
      { key: '→', desc: 'eKEY_RIGHT' },
      { key: 'Home', desc: 'eKEY_LEFT_END' },
      { key: 'End', desc: 'eKEY_RIGHT_END' },
      { key: 'Insert', desc: 'eKEY_INS' },
      { key: 'Delete', desc: 'eKEY_DEL' },
      { key: 'Esc', desc: 'eKEY_CLEAR' },
      { key: '/', desc: 'eKEY_DIV' },
      { key: ',', desc: 'eKEY_COMMA' },
      { key: '[', desc: 'eKEY_LBRACKET' },
      { key: ']', desc: 'eKEY_RBRACKET' },
      { key: 'Space', desc: 'eKEY_SPACE' },
      { key: '.', desc: 'eKEY_DOT' },
      { key: '-', desc: 'eKEY_MINUS' },
      { key: '=', desc: 'eKEY_EQUALS' },
      { key: '\'', desc: 'eKEY_QUOTE' },
      { key: '1', desc: 'eKEY_1' },
      { key: '2', desc: 'eKEY_2' },
      { key: '3', desc: 'eKEY_3' },
      { key: '4', desc: 'eKEY_4' },
      { key: '5', desc: 'eKEY_5' },
      { key: '6', desc: 'eKEY_6' },
      { key: '7', desc: 'eKEY_7' },
      { key: '8', desc: 'eKEY_8' },
      { key: '9', desc: 'eKEY_9' },
      { key: '0', desc: 'eKEY_0' },
      { key: 'Num /', desc: 'eKEY_DIV' },
      { key: 'Num *', desc: 'eKEY_MUL' },
      { key: 'Num -', desc: 'eKEY_MINUS' },
      { key: 'Num +', desc: 'eKEY_PLUS' },
      { key: 'Num Enter', desc: 'eKEY_ENTER' },
      { key: '#', desc: 'eKEY_HASH' },
      { key: '$', desc: 'eKEY_DOLLAR' },
      { key: '%', desc: 'eKEY_PERCENT' },
      { key: '&', desc: 'eKEY_AMPERSAND' },
      { key: ';', desc: 'eKEY_SEMICOLON' },
      { key: '@', desc: 'eKEY_AT' },
      { key: '\\', desc: 'eKEY_BACKSLASH' },
      { key: 'PageUp', desc: 'eKEY_PAGE_UP' },
      { key: 'PageDown', desc: 'eKEY_PAGE_DOWN' },
      { key: 'Backspace', desc: 'eKEY_BACKSPACE' }
    ]
  },
  {
    title: 'Shift',
    items: [
      { key: 'Shift+1', desc: '!' },
      { key: 'Shift+2', desc: '@' },
      { key: 'Shift+3', desc: '#' },
      { key: 'Shift+4', desc: '$' },
      { key: 'Shift+5', desc: '%' },
      { key: 'Shift+6', desc: '^' },
      { key: 'Shift+7', desc: '&' },
      { key: 'Shift+8', desc: '*' },
      { key: 'Shift+9', desc: '(' },
      { key: 'Shift+0', desc: ')' },
      { key: 'Shift+[', desc: '{' },
      { key: 'Shift+]', desc: '}' },
      { key: 'Shift+;', desc: ':' },
      { key: 'Shift+\'', desc: '"' },
      { key: 'Shift+/', desc: '?' },
      { key: 'Shift+=', desc: '+' },
      { key: 'Shift+.', desc: '>' },
      { key: 'Shift+,', desc: '<' },
      { key: 'Shift+Insert', desc: 'PASTE' },
      { key: 'Shift+-', desc: '_' },
      { key: 'Shift+\\', desc: '|' },
      { key: 'Shift+`', desc: '~' }
    ]
  },
  {
    title: 'Alt',
    items: [
      { key: 'Alt+x', desc: 'EXIT' },
      { key: 'Alt+r', desc: 'FORMAT' },
      { key: 'Alt+o', desc: 'MODE' },
      { key: 'Alt+d', desc: 'DRAW' },
      { key: 'Alt+h', desc: 'MATH' },
      { key: 'Alt+i', desc: 'LIST' },
      { key: 'Alt+e', desc: 'STAT' },
      { key: 'Alt+l', desc: 'TABLE' },
      { key: 'Alt+f', desc: 'CALC' },
      { key: 'Alt+b', desc: 'TBLSETUP' },
      { key: 'Alt+v', desc: 'VARS' },
      { key: 'Alt+s', desc: 'ASIN' },
      { key: 'Alt+c', desc: 'ACOS' },
      { key: 'Alt+a', desc: 'ATAN' },
      { key: 'Alt+q', desc: 'X²' },
      { key: 'Alt+g', desc: 'POW_10' },
      { key: 'Alt+n', desc: 'POW_E' },
      { key: 'Alt+m', desc: 'MEM' },
      { key: 'Alt+1', desc: 'POW_-1' },
      { key: 'Alt+p', desc: 'PI' },
      { key: 'Alt+w', desc: 'EXPONENT' },
      { key: 'Alt+→', desc: 'STORE' }
    ]
  },
  {
    title: 'Ctrl',
    items: [
      { key: 'Ctrl+f', desc: 'OFF' },
      { key: 'Ctrl+m', desc: 'MATRIX' },
      { key: 'Ctrl+o', desc: 'STATPLOT' },
      { key: 'Ctrl+p', desc: 'APPS' },
      { key: 'Ctrl+r', desc: 'PRGM' },
      { key: 'Ctrl+l', desc: 'CATALOG' },
      { key: 'Ctrl+e', desc: 'ANGLE' },
      { key: 'Ctrl+d', desc: 'DISTR' },
      { key: 'Ctrl+t', desc: 'TEST' },
      { key: 'Ctrl+y', desc: 'ENTRY' },
      { key: 'Ctrl+i', desc: 'COMPLEX_I' },
      { key: 'Ctrl+s', desc: 'SIN' },
      { key: 'Ctrl+c', desc: 'COS' },
      { key: 'Ctrl+a', desc: 'TAN' },
      { key: 'Ctrl+q', desc: 'SQRT' },
      { key: 'Ctrl+g', desc: 'LOG' },
      { key: 'Ctrl+n', desc: 'LN' },
      { key: 'Ctrl+u', desc: 'ARG' },
      { key: 'Ctrl+w', desc: 'POW_TEN' },
      { key: 'Ctrl+1', desc: 'LIST1' },
      { key: 'Ctrl+2', desc: 'LIST2' },
      { key: 'Ctrl+3', desc: 'LIST3' },
      { key: 'Ctrl+4', desc: 'LIST4' },
      { key: 'Ctrl+5', desc: 'LIST5' },
      { key: 'Ctrl+6', desc: 'LIST6x' },
      { key: 'Ctrl+b', desc: 'RCL' },
      { key: 'Ctrl+Num1', desc: 'LIST1' },
      { key: 'Ctrl+Num2', desc: 'LIST2' },
      { key: 'Ctrl+Num3', desc: 'LIST3' },
      { key: 'Ctrl+Num4', desc: 'LIST4' },
      { key: 'Ctrl+Num5', desc: 'LIST5' },
      { key: 'Ctrl+Num6', desc: 'LIST6x' },
      { key: 'Ctrl+NumEnter', desc: 'SOLVE' },
      { key: 'Ctrl+Enter', desc: 'SOLVE' },
      { key: 'Ctrl+-', desc: 'UNARY_MINUS' },
      { key: 'Ctrl+Num-', desc: 'UNARY_MINUS' },
      { key: 'Ctrl+Insert', desc: 'COPY' },
      { key: 'Ctrl+→', desc: 'STORE' }
    ]
  }
];
function renderShortcuts() {
  const dropdown = document.getElementById('shortcutsDropdown');
  if (!dropdown) return;
  dropdown.innerHTML = '';

	shortcutGroups.forEach(group => {
		// const groupDiv = document.createElement('div');
		// groupDiv.className = 'shortcut-group';

		// const groupTitle = document.createElement('div');
		// groupTitle.className = 'shortcut-title';
		// groupTitle.textContent = group.title;
		// groupDiv.appendChild(groupTitle);

		// const ul = document.createElement('ul');
		// ul.className = 'shortcut-list';

		group.items.forEach(item => {
			const div = document.createElement('div');
			div.className = 'body-dropdown__item';
			div.innerHTML = `<kbd class="body-dropdown__key">${item.key}</kbd><span class="body-dropdown__desc">${item.desc}</span>`;
			// ul.appendChild(li);
			dropdown.append(div);
		});

		// groupDiv.appendChild(ul);
		// dropdown.appendChild(groupDiv);
	});
}

// Запусти после загрузки DOM (и после инициализации калькулятора)
document.addEventListener('DOMContentLoaded', function () {
	renderShortcuts();
});