'use strict';

const checkedProject = document.getElementById('checkedProject');
const btnSearchCampare = document.getElementById('btnSearchCampare');
const conditionCntEq = document.getElementById('conditionCntEq');
const fileNmErrFl_tiff = document.getElementById('fileNmErrFl_tiff');
const fileNmErrFl_pdf = document.getElementById('fileNmErrFl_pdf');
const fileErrFl_tiff = document.getElementById('fileErrFl_tiff');
const fileErrFl_pdf = document.getElementById('fileErrFl_pdf');
const btnSaveExcel = document.getElementById('btnSaveExcel');
const btnViewMore = document.getElementById('btnViewMore');
const btnHideMore = document.getElementById('btnHideMore');
const mainContentArea = document.getElementById('mainContentArea');
const $mainContent = $('#mainContent');
const $pageArea = $('#pageArea');

const initMoreBtn = function () {
	btnViewMore.classList.remove('hide');
	btnHideMore.classList.add('hide');
};

const searchCompare = function (currentPageNo) {
	initMoreBtn();
	$.ajax({
		url: '/getCompareList',
		data: {id: checkedProject.value, current_page_no: currentPageNo, function_name: 'searchCompare', file_nm_err_fl_tiff: fileNmErrFl_tiff.value,
			file_nm_err_fl_pdf: fileNmErrFl_pdf.value, file_err_fl_tiff: fileErrFl_tiff.value, file_err_fl_pdf: fileErrFl_pdf.value, chk_cd: checkedProject.selectedOptions[0].dataset.chkCd
		},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			writeCompareList(result);
			if (result.data.totalCount > 0) {
				btnViewMore.disabled = false;
				return;
			}
			btnViewMore.disabled = true;
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

const writeCompareList = function (obj) {
	const data = obj.data;
	const list = data.list;
	
	let html = ``;
	if (data.totalCount === 0) {
		html += `<tr class="text-center"><td colspan="10">조회된 목록이 없습니다.</td></tr>`;
	}
	list.forEach((item) => {
		html += `<tr class="text-center">`;
		html += `	<td>${item.orderNum}<input type="hidden" name="doc_id" value="${item.doc_id}"></td>`;
		html += `	<td>${presCdMap.get(item.president_cd)}</td>`;
		html += `	<td>${item.mgmt_num}</td>`;
		html += `	<td>${item.doc_num}</td>`;
		html += `	<td>${item.file_nm_tiff}</td>`;
		html += `	<td>${item.file_nm_pdf}</td>`;
		html += `	<td>${errorMap.get(item.file_nm_err_fl_tiff)}</td>`;
		html += `	<td>${errorMap.get(item.file_nm_err_fl_pdf)}</td>`;
		html += `	<td>${errorMap.get(item.file_err_fl_tiff)}</td>`;
		html += `	<td>${errorMap.get(item.file_err_fl_pdf)}</td>`;
		html += `	<td class="view-more hide">${item.pixel_tiff}</td>`;
		html += `	<td class="view-more hide">${convertEmptyStr(item.pixel_pdf, '-')}</td>`;
		html += `	<td class="view-more hide">${item.file_size_tiff}</td>`;
		html += `	<td class="view-more hide">${convertEmptyStr(item.file_size_pdf, '-')}</td>`;
		html += `	<td class="view-more hide">${compareStr(item.h_dpi_tiff, 400)}</td>`;
		html += `	<td class="view-more hide">${compareStr(item.h_dpi_pdf, 400)}</td>`;
		html += `	<td class="view-more hide">${isLZW(item.comp_type_tiff)}</td>`;
		html += `	<td class="view-more hide">${isLZW(item.comp_type_pdf)}</td>`;
		html += `</tr>`;
	});
	
	resetContentSize();
	$mainContent.html(html);
	$pageArea.html(data.pagination);
};

const saveExcel = function () {
	if (checkedProject.value === 'none') {
		alertByModal(MSG_SELECT_PROJECT, MSG_CHECK_PROJECT);
		return;
	}
	const params = writeQueryString('id', 'file_nm_err_fl_tiff', 'file_nm_err_fl_pdf', 'file_err_fl_tiff', 'file_err_fl_pdf');
	$.ajax({
		url: '/getCompareTotCnt',
		data: {id: checkedProject.value, file_nm_err_fl_tiff: fileNmErrFl_tiff.value, file_nm_err_fl_pdf: fileNmErrFl_pdf.value, file_err_fl_tiff: fileErrFl_tiff.value, file_err_fl_pdf: fileErrFl_pdf.value},
		dataType: 'JSON',
		cache: false,
		type: 'POST',
		success: function (result) {
			if (result.data.totalCount !== 0) {
				location.href=`/saveCompareListExcel?${params}&forExcel=Y&chk_cd=`+checkedProject.selectedOptions[0].dataset.chkCd;
				return;
			}
			alertByModal(result.msg);
		},
		error: function (xhr, status, error) {
			console.log(xhr, status, error);
		},
	});
};

btnSearchCampare.addEventListener('click', function () {
	if (checkedProject.value === 'none') {
		alertByModal(MSG_SELECT_PROJECT, MSG_CHECK_PROJECT);
		return;
	}
	searchCompare(1);
});

const toggleBtnMore = function () {
	btnHideMore.classList.toggle('hide');
	btnViewMore.classList.toggle('hide');
};

const viewMore = function () {
	toggleBtnMore();
	document.querySelectorAll('.view-more').forEach(el => el.classList.remove('hide'));
	mainContentArea.classList.add('wide-vw', 'pe-4');
};

const hideMore = function () {
	toggleBtnMore();
	document.querySelectorAll('.view-more').forEach(el => el.classList.add('hide'));
	mainContentArea.classList.remove('wide-vw', 'pe-4');
};

const resetContentSize = function () {
	document.querySelectorAll('.view-more').forEach(el => el.classList.add('hide'));
	mainContentArea.classList.remove('wide-vw', 'pe-4');
};
btnSaveExcel.addEventListener('click', saveExcel);
btnViewMore.addEventListener('click', viewMore);
btnHideMore.addEventListener('click', hideMore);
getCheckedProjectList();