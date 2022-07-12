'use strict';

const checkedProject = document.getElementById('checkedProject');
const btnSearchHash = document.getElementById('btnSearchHash');
const hashEqFl = document.getElementById('hashEqFl');
const btnSaveExcel = document.getElementById('btnSaveExcel');
const btnPopupHash = document.getElementById('btnPopupHash');
const $modalRegHash = $('#modalRegHash');
const validMsgHash = document.getElementById('validMsgHash');
const btnRegHash = document.getElementById('btnRegHash');
const $formHash = $('#formHash');

const searchHash = function (currentPageNo = 1) {
	$.ajax({
		url: '/getHashList',
		data: {id: checkedProject.value, current_page_no: currentPageNo, hash_eq_fl: hashEqFl.value, function_name: 'searchHash'},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			writeHashList(result);
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

const writeHashList = function (obj) {
	const data = obj.data;
	const list = data.list;
	
	let html = ``;
	if (data.totalCount === 0) {
		html += `<tr class="text-center"><td colspan="8">조회된 목록이 없습니다.</td></tr>`;
	}
	list.forEach((item, idx) => {
		html += `<tr class="text-center">`;
		html += `	<td>${item.orderNum}</td>`;
		if (presCdMap.get(item.president_cd)) {
			html += `	<td>${presCdMap.get(item.president_cd)}</td>`;
		} else {
			html += `	<td>알수없음</td>`;
		}
		html += `	<td>${item.mgmt_num}</td>`;
		html += `	<td>${item.doc_num}</td>`;
		html += `	<td>${item.file_nm_pdf}</td>`;
		html += `	<td class="fs-7">${item.before_hash_val}</td>`;
		html += `	<td class="fs-7">${item.after_hash_val}</td>`;
		if (item.before_hash_val === item.after_hash_val) {
			html += `	<td>일치</td>`;
		} else if (item.after_hash_val === UNREG) {
			html += `	<td>미등록</td>`;
		} else {
			html += `	<td>불일치</td>`;
		}
		html += `</tr>`;
	});
	
	$('#mainContent').html(html);
	$('#pageArea').html(data.pagination);
};

const saveExcel = function () {
	if (checkedProject.value === 'none') {
		alertByModal(MSG_SELECT_PROJECT, MSG_CHECK_PROJECT);
		return;
	}
	const params = writeQueryString('id', 'hash_eq_fl');
	$.ajax({
		url: '/getHashCnt',
		data: {id: checkedProject.value, hash_eq_fl: hashEqFl.value},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			if (result.data.totalCount !== 0) {
				location.href=`/saveHashListExcel?${params}&forExcel=Y`;
				return;
			}
			alertByModal(result.msg);
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

const popupRegHash = function () {
	if (checkedProject.value === 'none') {
		alertByModal(MSG_SELECT_PROJECT, MSG_CHECK_PROJECT);
		return;
	}
	if (checkedProject.value === 'none') {
		alertByModal(MSG_SELECT_PROJECT, MSG_CHECK_PROJECT);
		return;
	}
	document.getElementsByName('hashFile')[0].value = '';
	resetValidMsgHash();
	$modalRegHash.modal('show');
};

const regHash = function () {
	if (!isExcel(document.getElementsByName('hashFile')[0].value)) {
		validMsgHash.classList.remove('hide');
		validMsgHash.value = '확장자가 xlsx인 파일을 첨부해주세요.';
		return;
	}
	resetValidMsgHash();
	$modalRegHash.modal('hide');
	$formHash.ajaxSubmit({
		url: '/regHash',
		contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
		data: {id: checkedProject.value, president_cd: Array.from(checkedProject.options).filter(el => el.selected)[0].dataset.presidentCd},
		type: 'post',
		dataType: 'JSON',
		success: function(result) {
			alertByModal(result.msg);
			searchHash();
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

const resetValidMsgHash = function () {
	validMsgHash.value = '';
	validMsgHash.classList.add('hide');
};

const downTemp = function () {
	location.href=`/downHashTemplate`;
};

btnSearchHash.addEventListener('click', function () {
	if (checkedProject.value === 'none') {
		alertByModal(MSG_SELECT_PROJECT, MSG_CHECK_PROJECT);
		return;
	}
	searchHash();
});
btnSaveExcel.addEventListener('click', saveExcel);
btnPopupHash.addEventListener('click', popupRegHash);
btnRegHash.addEventListener('click', regHash);
document.getElementById('btnDownTemp').addEventListener('click', downTemp);

getCheckedProjectList();