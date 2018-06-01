/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2017.09.06
 *
 * 닷컴 - 해외 - 하나팩 - 예약&결제
 * 
 * history
 * 
 * 1.0   (2017.09.06) : 
 *
 */

(function (scope) {
    if (scope.BOOKING !== undefined) return;

    var BOOKING = {
        //
    };

    scope.BOOKING = BOOKING;
})(window);

//페이지 진입 후 hash 따라 팝업 생성
$(window).on('load', function () {
    if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') DOTCOM.locationHashChanged();
});

$(document).ready(function () {
    if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') window.addEventListener('hashchange', DOTCOM.locationHashChanged);

    var header = $('#header');
    var wrapDIV = $('#wrap');
    var payBtn = wrapDIV.find('.m_btnRed, .btmBtnBox');

    $('body').on('open.slidepop', '#overlayPanel', completePopup); //팝업모션 완료후 실행 함수 정의 
    $('body').on('open.loadpop', '#overlayPanel', initPopup); //팝업로드 완료후 실행 함수 정의 

    initTab();          //탭
    initPay();			//결제
    addEvent();         //이벤트

    /**********************************************************************************************
     ********************************************* 결제 *******************************************
     **********************************************************************************************/

    function addEvent() {
        $(document).on('scroll.booking', function (e) {
            checkPayBtn();
        });

        $('.reserv_section').on('focusin.booking focusout.booking', 'input[type="text"], input[type="password"]', function (e) {
            wrapDIV.toggleClass('notFixed', e.type === 'focusin');
        });
    }

    //탭
    function initTab() {
        if (typeof WToggle !== 'undefined') {
            var pinkArrow = new WToggle();
            pinkArrow.init({target: wrapDIV, selector: '.bd_inrig > button.miniBtn02', onlyOpen: false, onTag: 'button', content: wrapDIV, contentSelector: '.bd_inrig~div.beneDis_btmCont'});
        }
    }
    
    //결제
    function initPay() {
    	//활불방법
    	$('.reserv_content').on('change.booking', '.refundCont > div.refundSelect > label > input.redCheck', function (e) {
    		var target = $(e.currentTarget);
    		var idx = target.closest('label.comRadio').index();

    		target.closest('.refundSelect').nextAll('div.refund_inTab').hide().eq(idx).show();
    	});

    	//결제금액 정보 
    	$('.reserv_content').on('change.booking', '.payTotal_box > div > label > input.redCheck', function (e) {
    		var target = $(e.currentTarget);
    		var idx = target.closest('div').index();

    		target.closest('.payTotal_box').nextAll('ul.payTotal_money').hide().eq(idx).show();
    	});

        //결제예정금액 x 버튼
        $('.reserv_content').on('click.booking', '.payTotal_money > li > .ico_ip > button.inputDelBtn', function (e) {
            var target = $(e.currentTarget);
            var input = target.prev('input.inputTxt');

            input.val('').focus();
        });

        //결제예정금액 x 버튼 활성화 & 비활성화
        $('.reserv_content').on('focusin.booking, focusout.booking, input.booking', '.payTotal_money > li > .ico_ip > input.inputTxt', function (e) {
            var target = $(e.currentTarget);
            var parent = target.closest('div.ico_ip');

            parent.toggleClass('withBtn', target.val().length > 0);
        });
    }

    //결제하기 메뉴
    function checkPayBtn() {
        if (payBtn.length === 1) {
            var contH = 0; //section 아래 버튼을 뺀 컨텐츠 높이
            $('.reserv_section > .reserv_content:last').prevAll().andSelf().not(':hidden').each(function () {
                contH += $(this).outerHeight() + parseInt($(this).css('marginBottom'));
            });

            var isNotFixed = (WDDO.scrollYpos + WDDO.browserHeight > $('section.reserv_section').offset().top + contH + payBtn.outerHeight());

            if (payBtn.is('a')) { //payment_progress
                payBtn.toggleClass('fixed', !isNotFixed);
            } else { //reserv_detail
                payBtn.toggleClass('static', isNotFixed);
            }
            
        }
    }

    //인원선택 초기화 함수
    function initPeople(wrap) {
        wrap.on('click.booking', '> button', function (e) {
            var target = $(e.currentTarget);
            var text = target.siblings('strong');
            var idx = target.closest('li').index(); 

            if (target.hasClass('plus')) {
                text.text( parseInt(text.text()) + ((getTotel() >= 30) ? 0 : 1) );
            } else if (target.hasClass('minus')) {
                text.text( Math.max(parseInt(text.text()) - 1, (idx === 0 ? 1: 0)) ); //성인은 기본 1
            }
        });

        function getTotel() {
        	var t = 0;
        	wrap.find('> strong').each(function (idx) {
            	t += parseInt($(this).text());
            });

            return t;
        }
    }

    //ok캐시백 조회 팝업 내 카드번호 input
    function initOKCashBack(input) {
        if (input.length > 0) {
            input.on('input.booking', function (e) {
                var target = $(e.currentTarget);

                if (target.val().length === 4) {
                    var nextInput = target.closest('div').nextAll('div').filter(function () {return $(this).length > 0}).eq(0).find('input');

                    //if (nextInput.length > 0) nextInput.select();
                    if (nextInput.length > 0) {
                        $(document).focus();
                        setTimeout(function () {nextInput.focus();}, 3000);
                    }
                }
            });
        }
    }

    /**********************************************************************************************
     ********************************************* 공통 *******************************************
     **********************************************************************************************/

    //팝업로드 완료후 실행 함수 정의 
    function initPopup() {
        var popInner = $('#overlayPanel div.fullPopCommon');

        if (popInner.length > 0) {
            DOTCOM.initToggle(popInner);
            
            //맵토글
            var mapTab = new WToggle();
            mapTab.init({target: popInner, selector: 'ul.helper_addressList > li >.btnAddress > button.mapToggle', onlyOpen: false, onTag: 'button', content: popInner, contentSelector: 'ul.helper_addressList > li > .map_loaction'})
            
            //btnBox
			var btnboxTab = new WToggle();
            btnboxTab.init({target: popInner, selector: '.btnBox > button', onlyOpen: false, onTag: 'button', content: popInner, contentSelector: '.btnBox ~ div.insur_img'});

            initPeople(popInner.find('.ppSelect'));

            initOKCashBack(popInner.find('.ok_cardNum input'));
        } //end if
    }

    //팝업모션 완료후 실행 함수 정의 
    function completePopup() {
        var popInner = $('#overlayPanel div.fullPopCommon');

        if (popInner.length > 0) {
            
        }
    }

    /**********************************************************************************************
     **************************************** 외부 제공 함수 **************************************
     **********************************************************************************************/

    BOOKING.initPopup = initPopup;
});
