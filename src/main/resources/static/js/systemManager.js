'use strict';

const mainContent = document.getElementById('mainContent');
const btnModPopup = document.getElementById('btnModPopup');
const btnChkPopup = document.getElementById('btnChkPopup');
const btnDelPopup = document.getElementById('btnDelPopup');
const $modalChckPrj = $('#modalChckPrj');
const formPrj = document.getElementById('formPrj');
const $modalPrj = $('#modalPrj');
const modalPrjTitle = document.getElementById('modalPrjTitle');
const $modalErrList = $('#modalErrList');
const $errContent = $('#errContent');
const prjNm = document.getElementById('prjNm');
const filePath = document.getElementById('filePath');
const filePath2 = document.getElementById('filePath2');
const btnSavePrj = document.getElementById('btnSavePrj');
const id = document.getElementById("id");
const $formPrj = $('#formPrj');
const $formPrjList = $('#formPrjList');
const frstChk = document.getElementById('frstChk');
const scndChk = document.getElementById('scndChk');
const chkType = document.getElementById('chkType');
const btnChkPrj = document.getElementById('btnChkPrj');
const chkTypes = Array.from(document.getElementsByClassName('chkType'));
const validMsgChk = document.getElementById('validMsgChk');
const validMsgPrj = document.getElementById('validMsgPrj');
const presidentCd = document.getElementById('presidentCd');
const btnDelPrj = document.getElementById('btnDelPrj');

let checkedRow = null;
let pageNo = 1;
let listCnt = 0;

const initBtns = function () {
	btnModPopup.disabled = true;
	btnChkPopup.disabled = true;
	btnDelPopup.disabled = true;
	checkedRow = null;
};

const getProjectList = function (currentPageNo) {
	if (currentPageNo === undefined || currentPageNo < 1) {
		currentPageNo = '1';
	}

	$('#current_page_no').val(currentPageNo);
	$.ajax({
		url: '/getProjectList',
		data: $formPrjList.serialize(),
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			writeProjectList(result);
			initBtns();
			pageNo = currentPageNo;
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

const writeProjectList = function (obj) {
	const data = obj.data;
	const list = data.list;
	listCnt = data.list.length;
	
	let html = ``;
	if (data.totalCount === 0) {
		html += `<tr class="text-center"><td colspan="7">등록된 프로젝트가 없습니다.</td></tr>`;
	}
	list.forEach((item) => {
		html += `<tr class="text-center" data-id="${item.id}">`;
		html += `	<th scope="row" class="border">`;
		if (!(item.chk_cd === '01' || item.chk_cd === '03')) {
			html += `		<input class="form-check-input pointer" type="checkbox" value="${item.id}"/>`;
		} else {
			html += `		<input class="form-check-input pointer" type="checkbox" value="${item.id}" disabled/>`;
		}
		html += `	</th>`;
		html += `	<td class="border" name="id">${item.id}</td>`;
		html += `	<td class="border" name="prjNm">${item.prj_nm}</td>`;
		html += `	<td class="border" name="presidentCd" data-president-cd="${item.president_cd}">${item.president_cd}: ${presCdMap.get(item.president_cd)}</td>`;
		html += `	<td class="border" name="filePath">${item.file_path}</td>`;
		if (item.file_path2) {
			html += `	<td class="border" name="filePath2" data-file-path2="${item.file_path2}">${item.file_path2}</td>`;
		} else {
			html += `	<td class="border" name="filePath2" data-file-path2="${item.file_path2}">${UNREG}</td>`;
		}
		if (item.chk_cd !== '05' && item.chk_cd !== '06') {
			html += `	<td class="border chk-status" data-chk-cd="${item.chk_cd}">${checkCdMap.get(item.chk_cd)}</td>`;
		} else {
			html += `	<td class="border chk-status" data-chk-cd="${item.chk_cd}"><button type="button" class="btn btn-link p-0">${checkCdMap.get(item.chk_cd)}</button></td>`;
		}
		html += `</tr>`;
	});

	$('#mainContent').html(html);
	$('#pageArea').html(data.pagination);
}

const clickHandleMainContent = function (e) {
	if (e.target.closest('input[type=checkbox]')) {
		const targetCheckbox = e.target.closest('input[type=checkbox]');
		Array.from(mainContent.querySelectorAll('input[type=checkbox]')).filter(el => el !== targetCheckbox).forEach(el => el.checked = false);
		
		initBtns();
		if (targetCheckbox.checked === true) {
			checkedRow = Array.from(mainContent.querySelectorAll('input[type=checkbox]')).filter(el => el.checked === true)[0].closest('tr');
			const chkCd = checkedRow.getElementsByClassName('chk-status')[0].dataset.chkCd;
			if (chkCd === '00' || chkCd === '02') {
				btnModPopup.disabled = false;
				btnChkPopup.disabled = false;
			}
			btnDelPopup.disabled = false;
		}
	}
	
	const btnShowErr = e.target.closest('.btn-link');
	if (btnShowErr) {
		showErrList(btnShowErr.closest('tr').dataset.id, btnShowErr.closest('.chk-status').dataset.chkCd);
	}
};

const showErrList = function (id, chkCd) {
	$errContent.html('');
	$modalErrList.modal('show');
	$.ajax({
		url: '/getErrList',
		data: {id: id, chk_cd: chkCd},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			writeErrList(result.data.list);
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		}
	});
};

const writeErrList = function (list) {
	let html = ``;
	list.forEach(item => {
		html += `<div class="p-1 bd-highlight">${item.seq}. ${item.contents}</div>`;
	});
	$errContent.html(html);
};

const popupRegPrj = function () {
	setModalPrj({
		title: '프로젝트 등록',
	});
	btnSavePrj.removeEventListener('click', modPrj);
	btnSavePrj.addEventListener('click', regPrj);
	validMsgPrj.classList.add('hide');
	presidentCd.disabled = false;
	$modalPrj.modal('show');
};

const regPrj = function () {
	if (!validateRegPrj()) return;
	
	$.ajax({
		url: '/regProject',
		data: $formPrj.serialize(),
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			if (result.result === SUCCESS) {
				$modalPrj.modal('hide');
			} else {
				alertByModal('저장되지 않았습니다.\n관리자에게 문의해주세요');
			}
			getProjectList(1, 'Y');
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};


const popupModPrj = function () {
	const filePath2Val = checkedRow.querySelector('[name=filePath2]').textContent === UNREG ? '' : checkedRow.querySelector('[name=filePath2]').textContent;
	setModalPrj({
		title: '프로젝트 수정',
		readOnly: true,
		id: checkedRow.dataset.id,
		presidentCd: checkedRow.querySelector('[name=presidentCd]').dataset.presidentCd,
		prjNm: checkedRow.querySelector('[name=prjNm]').textContent,
		filePath: checkedRow.querySelector('[name=filePath]').textContent,
		filePath2: filePath2Val,
	});
	btnSavePrj.removeEventListener('click', regPrj);
	btnSavePrj.addEventListener('click', modPrj);
	validMsgPrj.classList.add('hide');
	presidentCd.disabled = true;
	$modalPrj.modal('show');
};

const modPrj = function () {
	if (!validateRegPrj('2')) return;
	
	$.ajax({
		url: '/modProject',
		data: $formPrj.serialize(),
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			if (result.result === SUCCESS) {
				const path = $formPrj[0].querySelector('#filePath2').value;
				checkedRow.querySelector('[name=filePath2]').textContent = path;
				checkedRow.querySelector('[name=filePath2]').dataset.filePath2 = path;
				$modalPrj.modal('hide');
			} else {
				alertByModal('수정되지 않았습니다.\n관리자에게 문의해주세요');
			}
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

const setModalPrj = function (valObj) {
	modalPrjTitle.textContent = valObj.title;
	id.value = valObj.id || -1;
	prjNm.value = valObj.prjNm || '';
	prjNm.readOnly = filePath.readOnly = valObj.readOnly || false;
	presidentCd.disabled = valObj.readOnly || false;
	filePath.value = valObj.filePath || '';
	filePath2.value = valObj.filePath2 || '';
	if (valObj.presidentCd) {
		Array.from(presidentCd.options).filter(el => el.value === valObj.presidentCd)[0].selected = true;
	} else {
		Array.from(presidentCd.options).filter(el => el.value === '001')[0].selected = true;
	}
};

const setModalPrjTitle = function (text) {
	modalPrjTitle.textContent = text;
};

const validateRegPrj = function (type) {
	if (isEmpty(prjNm.value)) {
		writeValidPrjMessage('프로젝트명을 입력해주세요.');
		return false;
	}
	if (isEmpty(filePath.value)) {
		writeValidPrjMessage('1차 파일경로를 입력해주세요.');
		return false;
	}
	if (type === '2' && !filePath2.value) {
		writeValidPrjMessage('2차 파일경로를 입력해주세요.');
		return false;
	}
	validMsgPrj.classList.add('hide');
	return true;
};

const writeValidPrjMessage = function (msg) {
	validMsgPrj.classList.remove('hide');
	validMsgPrj.value = msg;
};

const popupChkPrj = function () {
	btnChkPrj.disabled = true;
	validMsgChk.classList.add('hide');
	setCheckboxState();
	$modalChckPrj.modal('show');
};

const setCheckboxState = function () {
	chkTypes.forEach(el => {
		el.checked = false;
		el.disabled = true;
	});
	const chkCd = checkedRow.getElementsByClassName('chk-status')[0].dataset.chkCd;
	if (chkCd === '00') {
		frstChk.disabled = false;
	}
	if (chkCd === '02') {
		scndChk.disabled = false;
	}
};

const checkPrj = function () {
	if (chkType.value === '2' && !checkedRow.querySelector('[name=filePath2]').dataset.filePath2) {
		validMsgChk.classList.remove('hide');
		validMsgChk.value = '2차 파일 경로가 등록되지 않았습니다.';
		return;
	}
	const currentState = checkedRow.closest('tr').querySelector('.chk-status').dataset.chkCd;
	const state = '0' + (window.parseInt(currentState) + 1).toString();
	updateProjectStatus(state);
};

const updateProjectStatus = function (state) {
	$.ajax({
		url: '/updateProjectStatus',
		data: {id: checkedRow.dataset.id, chk_cd: state},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			if (result.result === SUCCESS) {
				setChkStatus(checkedRow, state);
				const checkedBox = checkedRow.querySelector('[type=checkbox]');
				check(checkedBox);
				checkedBox.click();
				checkedBox.disabled = true;
				$modalChckPrj.modal('hide');
			} else {
				alertByModal('상태가 변경되지 않았습니다.\n관리자에게 문의해주세요');
			}
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

const check = function (checkedBox) {
	$.ajax({
		url: '/checkProject',
		data: {id: checkedBox.value, chk_type: chkType.value},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
		complete: function () {
			alertByModal('검사가 시작되었습니다.');
			setProjectStatus(checkedBox);
		}
	});
};

const setProjectStatus = function (checkedBox) {
	$.ajax({
		url: '/getProjectStatus',
		data: {id: checkedBox.value},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			const chkCd = result.data;
			checkedBox.disabled = true;
			if (chkCd !== '01' && chkCd !== '03')
				checkedBox.disabled = false;
			setChkStatus(checkedBox.closest('tr'), result.data);
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

const setChkStatus = function (row, chkCd) {
	const statusEl = row.querySelector('.chk-status');
	statusEl.dataset.chkCd = chkCd;
	if (chkCd !== '05' && chkCd !== '06') {
		statusEl.textContent = checkCdMap.get(chkCd);
	} else {
		statusEl.innerHTML = `<button type="button" class="btn btn-link p-0">${checkCdMap.get(chkCd)}</button>`;
	}
};

const setChkType = function (e) {
	if (e.target.checked === true) {
		chkTypes.filter(el => el !== e.target)[0].checked = false;
		btnChkPrj.disabled = false;
		chkType.value = e.target.value;
		return;
	}
	btnChkPrj.disabled = true;
};

const popupDelPrj = function () {
	$('#staticBackdropConfirm').modal('show');
};

const delPrj = function () {
	$.ajax({
		url: '/delProject',
		data: {id: checkedRow.dataset.id},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			alertByModal(result.msg);
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
		complete: function () {
			if (listCnt !== 1)
				getProjectList(pageNo);
			else
				getProjectList(pageNo - 1);
		}
	});
};

mainContent.addEventListener('click', clickHandleMainContent);
btnChkPopup.addEventListener('click', popupChkPrj);
document.getElementById('btnRegPopup').addEventListener('click', popupRegPrj);
btnModPopup.addEventListener('click', popupModPrj);
btnChkPrj.addEventListener('click', checkPrj);
frstChk.addEventListener('change', setChkType);
scndChk.addEventListener('change', setChkType);
btnDelPopup.addEventListener('click', popupDelPrj);
btnDelPrj.addEventListener('click', delPrj);
getProjectList();

