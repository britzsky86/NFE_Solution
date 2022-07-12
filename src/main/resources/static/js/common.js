'use strict';

const alertContent = document.getElementById('alertContent');
const alertByModal = function (...texts) {
	let content = ``;
	texts.forEach(text => content += `${text}<br>`);
	alertContent.innerHTML = content;
	$('#staticBackdrop').modal('show');
};

(function () {
	Array.from(document.querySelectorAll('th')).filter(el => el.rowSpan === 2).forEach(el => el.classList.add('border-bottom-currentColor'));
})();

const getCheckedProjectList = function () {
	$.ajax({
		url: '/getCheckedProjectList',
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			if (result.length > 0) {
				writeCheckedProjectList(result);
			}
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

const writeCheckedProjectList = function (list) {
	list.forEach(data => {
		const option = document.createElement('option');
		option.value = data.id;
		option.textContent = data.prj_nm;
		option.dataset.presidentCd = data.president_cd;
		option.dataset.chkCd = data.chk_cd;
		checkedProject.appendChild(option);
	});
};

const isExcel = function (value) {
	const arr = value.split('.');
	if (arr[arr.length - 1] === 'xlsx') return true;
	return false;
};

const isLZW = function (value) {
	if (isEmpty(value)) {
		return '-';
	}
	if (value === 'LZW') {
		return 'O';
	}
	return 'X';
};

const compareStr = function (str, standard) {
	if (isEmpty(str) || str === 0 || str === '0') {
		return '-';
	}
	if (str === standard) {
		return 'O';
	}
	return 'X';
};

const writeQueryString = function (...names) {
	let result = ``;
	names.forEach(name => {
		const value = document.getElementsByName(name)[0].value;
		result += `${name}=${value}&`;
	});
	return result.substring(0, result.length - 1); 
};