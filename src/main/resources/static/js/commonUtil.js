function getOthersByClass(el, className) {
	const nodes = document.getElementsByClassName(className);
	let siblings = [];
	for (let i = 0; i < nodes.length; i++) {
		if (el !== nodes[i]) {
			siblings.push(nodes[i]);
		}
	}
	return siblings;
}

const submitForm = document.createElement('form');

function createSubmitForm(name, callUrl, method) {
	submitForm.setAttribute('name', name);
	submitForm.setAttribute('action', callUrl);
	submitForm.setAttribute('method', method);

	document.body.appendChild(submitForm);
}

const createHiddenInputsAndInsertToForm = function (...arrArgs) {
	arrArgs.forEach((arg) => {
		const input = document.createElement('input');
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', arg[0]);
		input.setAttribute('value', arg[1]);

		submitForm.appendChild(input);
	});
};

const createHiddenInputs = function (...arrArgs) {
	const result = [];
	arrArgs.forEach((arg) => {
		const input = document.createElement('input');
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', arg[0]);
		input.setAttribute('value', arg[1]);
		input.setAttribute('class', arg[2]);
		result.push(input);
	});
	return result;
};

const createElement = function (obj) {
	const result = document.createElement(obj.tag);
	if (obj.id) {
		result.setAttribute('id', obj.id);
	}
	if (obj.class) {
		if (typeof obj.class === 'string') {
			result.classList.add(obj.class);
		} else if (obj.class.length > 0) {
			obj.class.forEach(cls => result.classList.add(cls));
		}
	}
	return result;
};
function changeSerialize(formData, inputName, inputValue) {
	for (i = 0; i < formData.length; i++) {
		if (formData[i].name == inputName) {
			formData[i].value = inputValue;
		}
	}
}

function findValueInSerialize(formData, name) {
	for (i = 0; i < formData.length; i++) {
		if (formData[i].name === name) {
			return formData[i].value;
		}
	}
	return '';
}

const appendHtml = function (parent, html) {
	if (!parent) return;
	const docFrag = document.createDocumentFragment();
	const div = docFrag.appendChild(document.createElement('div'));
	div.innerHTML = html;
	reAssembleScriptInDOM(div);
	while (div.childElementCount) {
		parent.appendChild(div.firstChild);
	}
}

const prependHtml = function (parent, html) {
	if (!parent) return;
	const docFrag = document.createDocumentFragment();
	const div = docFrag.appendChild(document.createElement('div'));
	div.innerHTML = html;
	reAssembleScriptInDOM(div);
	while (div.childElementCount) {
		parent.prepend(div.lastChild);
	}
}

function reAssembleScriptInDOM(target) {
	target.querySelectorAll('script').forEach(el => {
		script = document.createElement('script');
		if (el.src) script.src = el.src;
		script.textContent = el.textContent;
		target.appendChild(script);
	});
}

function recordPageOfHash() {
	if (typeof page !== 'undefined') {
		window.location.hash = '#page' + page;
	}
}

function getPageFromHash() {
	if (window.location.hash) {
		let lastPage = parseInt(location.hash.split('#')[1].replace('page', ''));
		return lastPage / 20;
	}
	return 0;
}

function removeClassFromClass(objClassName, removedClassName) {
	const el = document.getElementsByClassName(objClassName);
	for (var i = 0; i < el.length; i++) {
		el[i].classList.remove(removedClassName);
	}
}

function getDocumentHeight() {
	const body = document.body;
	const html = document.documentElement;

	return Math.max(
		body.scrollHeight,
		body.offsetHeight,
		html.clientHeight,
		html.scrollHeight,
		html.offsetHeight
	);
}

function getScrollTop() {
	return window.pageYOffset !== undefined
		? window.pageYOffset
		: (document.documentElement || document.body.parentNode || document.body)
				.scrollTop;
}

function removeSpecialCharacters(text) {
	const specialCharacter = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
	if (text.length > 0 && text.match(specialCharacter)) {
		text = text.replace(specialCharacter, '');
	}
	return text;
}

function validateElement(el, count) {
	el.value = el.value.substring(0, count);
	el.value = removeSpecialCharacters(el.value);
}

function validateString(str, count) {
	str = str.substring(0, count);
	str = removeSpecialCharacters(str);
	return str;
}

function validateEachWord(array, count) {
	Array.prototype.forEach.call(array, function (el) {
		el.setAttribute('maxlength', count);
		el.addEventListener('keyup', function (e) {
			validateElement(el, count);
		});
	});
}

HTMLElement.prototype.closestByClass = function (className) {
	let target = this;
	while (!target.parentElement.classList.contains(className)) {
		if (target.parentElement == null) {
			return null;
		}
		target = target.parentElement;
	}
	return target.parentElement;
};

HTMLElement.prototype.siblingByClass = function (className) {
	let target = this;
	let children = target.parentElement.children;
	for (let i = 0; i < children.length; i++) {
		if (children[i].classList.contains(className)) {
			return children[i];
		}
	}
	return null;
};

HTMLElement.prototype.toggle = function () {
	let target = this;
	if (target.style.display === 'none') {
		target.style.display = '';
	} else {
		target.style.display = 'none';
	}
};

function siblings(el) {
	let tempArr = new Array();
	let children = el.parentElement.children;
	for (var i = 0; i < children.length; i++) {
		tempArr.push(children[i]);
	}
	return tempArr.filter(function (e) {
		return e !== el;
	});
}

function removeClassForArray(nodes, className) {
	Array.prototype.forEach.call(nodes, function (el) {
		el.classList.remove(className);
	});
}

function toggleArrayNode(array) {
	Array.prototype.forEach.call(array, function (el) {
		if (el.style.display === 'none') {
			el.style.display = 'block';
		} else {
			el.style.display = 'none';
		}
	});
}

function hideArrayNode(array) {
	Array.prototype.forEach.call(array, function (el) {
		el.style.display = 'none';
	});
}

function showArrayNode(array) {
	Array.prototype.forEach.call(array, function (el) {
		el.style.display = '';
	});
}

function toggleElement(el) {
	if (el.style.display === 'none') {
		el.style.display = '';
	} else {
		el.style.display = 'none';
	}
}

function replaceAll(str, searchStr, replaceStr) {
	return str.split(searchStr).join(replaceStr);
}

function toggleOneHideOthersByClass(className, el) {
	const nodes = document.getElementsByClassName(className);
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i] !== el) {
			nodes[i].style.display = 'none';
		}
	}
	if (el.style.display !== 'none') {
		el.style.display = 'none';
	} else {
		el.style.display = '';
	}
}

function toggleClassForOneRemoveOthersByClass(className, toggleClass, el) {
	const nodes = document.getElementsByClassName(className);
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i] !== el) {
			nodes[i].classList.remove(toggleClass);
		}
	}
	el.classList.toggle(toggleClass);
}

function trimAndRemoveSpace(str) {
	return str.trim().replace(/(\s*)/g, '');
}

function setOtherDataset(nodes, target, name, beforeValue, afterValue) {
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i] !== target && nodes[i].dataset[name] === beforeValue) {
			nodes[i].dataset[name] = afterValue;
		}
	}
}

function findParentByTag(el, tagName) {
	let target = el.parentElement;
	while (true) {
		if (target.tagName === tagName) {
			return target;
		}
		target = target.parentElement;
	}
}

function checkAllInTbodyBootstrap(el) {
	const checkboxs = findParentByTag(el, 'TABLE')
		.getElementsByTagName('tbody')[0]
		.querySelectorAll('input[type=checkbox]');
	if (el.checked) {
		for (let i = 0; i < checkboxs.length; i++) {
			checkboxs[i].checked = true;
			findParentByTag(checkboxs[i], 'SPAN').classList.add('checked');
		}
	} else {
		for (let i = 0; i < checkboxs.length; i++) {
			checkboxs[i].checked = false;
			findParentByTag(checkboxs[i], 'SPAN').classList.remove('checked');
		}
	}
}

function convertNumberToDashedDate(num) {
	if (num == null && num.toString().length !== 8) return num;
	const strNum = num.toString();
	return `${strNum.substring(0, 4)}-${strNum.substring(
		4,
		6
	)}-${strNum.substring(6, 8)}`;
}

$(document).ready(function () {
	$('input[type=date]').attr('max', '9999-12-31');
});

function findElementFromParent(childEl, targetEl) {
	const parent = childEl.parentElement;
	if (childEl === document.body || parent === document.body) return null;

	if (parent === targetEl) {
		return targetEl;
	} else {
		return findElementFromParent(parent, targetEl);
	}
}

function doAjax(options) {
	const [type, url, data, dataType, success, error] = setAjaxOptions(options);
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				success(xhr.response);
			} else {
				error(new Error(xhr.status));
			}
		}
	};
	let formedData;
	switch (type) {
		case 'GET':
			formedData =
				data != null
					? Object.keys(data)
							.map((key) => `${key}=${data[key]}`)
							.join('&')
					: null;
			xhr.open(type, `${url}?${formedData}`);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(null);
			xhr.responseType = dataType;
			break;
		case 'POST':
			xhr.open(type, url);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			formedData =
				data != null
					? Object.keys(data)
							.map((key) => `${key}=${data[key]}`)
							.join('&')
					: null;
			xhr.send(formedData);
			xhr.responseType = dataType;
			break;
		default:
			xhr.open(type, url);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(null);
			xhr.responseType = dataType || xhr.responseType;
			break;
	}
}


function setAjaxOptions(options) {
	let url = (data = success = error = null);
	let type = 'POST';
	let dataType = 'text';
	for (const key in options) {
		switch (key) {
			case 'type':
				type = options[key].toUpperCase();
				break;
			case 'url':
				url = options[key];
				break;
			case 'data':
				data = options[key];
				break;
			case 'dataType':
				dataType = options[key];
				break;
			case 'success':
				success = options[key];
				break;
			case 'error':
				error = options[key];
				break;
		}
	}
	return [type, url, data, dataType, success, error];
}

/*수정요함 class="class1 class2"이고 .class1{display:none}이면 class2.style.display 값 none으로 안 나오던데*/
const toggleDisplay = function (selector) {
	const target = document.querySelector(selector);
	if (target.style.display === 'none') {
		target.style.display = '';
		return;
	}
	target.style.display = 'none';
}

const fadeToggleBySelector = function (selector) {
	switch (selector[0]) {
		case '#':
			fadeToggle(document.getElementById(selector.substring(1, selector.length)));
			break;
		default:
			document.querySelectorAll(selector).forEach(el => fadeToggle(el));
			break;
	}
}

const fadeToggle = function (el) {
	if (el.classList.contains('arc-appear')) {
		fadeHide(el);
		return;
	}
	fadeShow(el);
}

const fadeShow = function (el) {
	el.classList.remove('arc-disappear');
	el.classList.add('arc-appear');
}

const fadeHide = function (el) {
	el.classList.add('arc-disappear');
	setTimeout(() => el.classList.remove('arc-appear'), 100);
}

const fadeHideHandler = function (selector) {
	document.body.addEventListener('click', function (e) {
		if (!e.target.closest(selector)) {
			//document.body.querySelectorAll(selector).forEach((el) => el.querySelectorAll('.arc-display-toggle-target').forEach((el) => fadeHide(el)));
		}
	});
};

const hideItem = function (item) {
	if (item) item.style.display = 'none';
}

const movePage = function (url) {
	location.href = url;
}

const wrapElement = function (target, wrapperTag, ...classes) {
	const wrapper = document.createElement(wrapperTag);
	classes.forEach(clss => wrapper.classList.add(clss));
	wrapper.innerHTML = target.outerHTML;
	target.parentNode.insertBefore(wrapper, target);
	target.remove();
	return wrapper;
};

const wrapAllElement = function (targets, wrapperTag) {
	Array.from(targets).forEach(el => wrapElement(el, wrapperTag));
}

const isEmpty = function(value) {
	if (value === "" || value === null || value === undefined || (value !== null && typeof value === 'object' && !Object.keys(value).length)) {
		return true;
	}
	return false;
}

const isNotEmpty = function(value) {
	if (value === "" || value === null || value === undefined || (value !== null && typeof value === 'object' && !Object.keys(value).length)) {
		return false;
	}
	return true;
}

const replaceNull = function (value, wordToReplace) {
	if (value === null || value === undefined || value === '') {
		return wordToReplace;
	}
	return value;
};

const exchangeChildsInnerHTML = function (el_a, el_b, ...excludeNums) {
	const children_a = el_a.children;
	const children_b = el_b.children;
	if (children_a.length !== children_b.length)
		return;
	
	for (let i = 0, length = children_a.length; i < length; i++) {
		if (excludeNums.indexOf(i) !== -1) continue;
		exchangeInnerHTML(children_a[i], children_b[i]);
	}
};

const resetForm = function (form) {
	form.reset();
	const selects = form.getElementsByTagName('select');
	for (let i = 0, length = selects.length; i < length; i++) {
		selects[i].options[0].selected = true;
	}
};

const convertEmptyStr = function (str, toReplace) {
	if (isEmpty(str))
		return toReplace;
	return str;
};