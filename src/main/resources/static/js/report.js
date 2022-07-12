'use strict';

const checkedProject = document.getElementById('checkedProject');
const btnSearch = document.getElementById('btnSearch');
const btnDetail = document.getElementById('btnDetail');
const btnResult = document.getElementById('btnResult');

const searchReport = function (currentPageNo = 1) {
	if (!existSelected()) return;
	if (!isSndChecked()) return;
	
	$.ajax({
		url: '/getReportList',
		data: {id: checkedProject.value, current_page_no: currentPageNo, function_name: 'searchReport'},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			writeReportList(result);
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

const writeReportList = function (obj) {
	const data = obj.data;
	const list = data.list;
	
	let html = ``;
	if (data.totalCount === 0) {
		html += `<tr class="text-center"><td colspan="7">조회된 목록이 없습니다.</td></tr>`;
	}
	list.forEach((item) => {
		html += `<tr class="text-center">`;
		html += `	<td class="border">${item.orderNum}</td>`;
		html += `	<td class="border">${item.chk_type}</td>`;
		html += `	<td class="border">${item.err_nm}</td>`;
		html += `	<td class="border">${item.mgmt_num}</td>`;
		html += `	<td class="border">${item.doc_num}</td>`;
		html += `	<td class="border">${item.file_nm}</td>`;
		html += `	<td class="border">${item.err_detail}</td>`;
		html += `</tr>`;
	});
	
	$('#mainContent').html(html);
	$('#pageArea').html(data.pagination);
}

const existSelected = function () {
	if (checkedProject.value === "none") {
		alertByModal(MSG_SELECT_PROJECT, MSG_CHECK_PROJECT);
		return false;
	}
	return true;
};

const saveDetailExcel = function () {
	if (!existSelected()) return;
	if (!isSndChecked()) return;
	
	$.ajax({
		url: '/getReportCnt',
		data: {id: checkedProject.value},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			if (result.data.totalCount > 0) {
				location.href=`/saveReportDetailExcel?id=${checkedProject.value}&forExcel=Y`;
				return;
			}
			alertByModal(result.msg);
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

const isSndChecked = function () {
	if (checkedProject.selectedOptions[0].dataset.chkCd !== '04') {
		alertByModal('2차검사가 완료되지 않았습니다.');
		return false;
	}
	return true;
};

const saveResultExcel = function () {
	if (!existSelected()) return;
	if (!isSndChecked()) return;
	
	$.ajax({
		url: '/getReportCnt',
		data: {id: checkedProject.value},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			if (result.data.totalCount > 0) {
				location.href=`/saveReportResultExcel?id=${checkedProject.value}`;
				return;
			}
			alertByModal(result.msg);
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

btnSearch.addEventListener('click', function () {
	searchReport();
});
btnDetail.addEventListener('click',saveDetailExcel);
btnResult.addEventListener('click', saveResultExcel);
getCheckedProjectList();
