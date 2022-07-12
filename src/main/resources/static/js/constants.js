'use strict';

const checkCdMap = new Map();
checkCdMap.set('00', '등록완료');
checkCdMap.set('01', '1차 검사중');
checkCdMap.set('02', '1차 검사완료');
checkCdMap.set('03', '2차 검사중');
checkCdMap.set('04', '2차 검사완료');
checkCdMap.set('05', '1차 검사오류');
checkCdMap.set('06', '2차 검사오류');

const hashCheckCdMap = new Map();
hashCheckCdMap.set('00', '미등록');
hashCheckCdMap.set('01', '등록중');
hashCheckCdMap.set('02', '등록완료');

const SUCCESS = 'SUCCESS';
const FAIL = 'FAIL';
const UNREG = '미등록';

const presCdMap = new Map();
presCdMap.set('001', '노무현');
presCdMap.set('002', '김대중');
presCdMap.set('003', '김영삼');
presCdMap.set('004', '전두환');
presCdMap.set('005', '박정희');
presCdMap.set('006', '이명박');
presCdMap.set('007', '최규하');
presCdMap.set('008', '노태우');
presCdMap.set('009', '박충훈');
presCdMap.set('010', '이승만');
presCdMap.set('011', '허정');
presCdMap.set('012', '곽상훈');
presCdMap.set('013', '윤보선');
presCdMap.set('014', '고건');
presCdMap.set('015', '박근혜');
presCdMap.set('016', '황교안');
presCdMap.set('017', '문재인');

const cntEqMap = new Map();
cntEqMap.set('Y', '일치');
cntEqMap.set('N', '불일치');

const errorMap = new Map();
errorMap.set('N', 'O');
errorMap.set('Y', 'X');

const MSG_SELECT_PROJECT = '프로젝트를 선택해주세요.';
const MSG_CHECK_PROJECT = '검사완료 프로젝트가 없을 경우 시스템관리에서 등록 후 검사해주세요.';
const MSG_REGIST_PROJECT = '등록된 프로젝트가 없을 경우 시스템 관리에서 등록해주세요.';