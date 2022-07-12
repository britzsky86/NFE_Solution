'use strict';

const checkedProject = document.getElementById('checkedProject');
const btnSearchDocs = document.getElementById('btnSearchDocs');
const fileCntEqFl = document.getElementById('fileCntEqFl');
const btnSaveExcel = document.getElementById('btnSaveExcel');

const searchDocs = function (currentPageNo) {
	$.ajax({
		url: '/getDocList',
		data: {id: checkedProject.value, current_page_no: currentPageNo, function_name: 'searchDocs', file_cnt_eq_fl: fileCntEqFl.value},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			writeDocList(result);
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

const writeDocList = function (obj) {
	const data = obj.data;
	const list = data.list;
	let html = ``;
	if (data.totalCount === 0) {
		html += `<tr class="text-center"><td colspan="8">조회된 목록이 없습니다.</td></tr>`;
	}
	list.forEach((item, idx) => {
		html += `<tr class="text-center">`;
		html += `	<td class="border">${item.orderNum}<input type="hidden" name="doc_id" value="${item.doc_id}"></td>`;
		html += `	<td class="border">${presCdMap.get(item.president_cd)}</td>`;
		html += `	<td class="border">${item.mgmt_num}</td>`;
		html += `	<td class="border">${item.doc_num}</td>`;
		html += `	<td class="border">${item.pdf_file_cnt}</td>`;
		html += `	<td class="border">${item.tiff_file_cnt}</td>`;
		html += `	<td class="border">${item.pdf_file_cnt}</td>`;
		html += `	<td class="border">${cntEqMap.get(item.file_cnt_eq_fl)}</td>`;
		html += `</tr>`;
	});
	
	$('#mainContent').html(html);
	$('#pageArea').html(data.pagination);
};

const saveExcel = function () {
	if (checkedProject.value === 'none') {
		alertByModal(MSG_SELECT_PROJECT, MSG_REGIST_PROJECT);
		return;
	}
	$.ajax({
		url: '/getDocCnt',
		data: {id: checkedProject.value, file_cnt_eq_fl: fileCntEqFl.value},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			if (result.data.totalCount !== 0) {
				location.href=`/saveDocListExcel?id=${checkedProject.value}&file_cnt_eq_fl=${fileCntEqFl.value}&forExcel=Y`;
				return;
			}
			alertByModal(result.msg);
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

btnSearchDocs.addEventListener('click', function () {
	if (checkedProject.value === 'none') {
		alertByModal(MSG_SELECT_PROJECT, MSG_REGIST_PROJECT);
		return;
	}
	searchDocs(1);
});
btnSaveExcel.addEventListener('click', saveExcel);

getCheckedProjectList();