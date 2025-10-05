var inp;
var cursect = 0;
var sections = [];
var offsections = [];
let template_val = {};
let template_data = {};
var data_value = {};
var iframe = $('iframe');
var tplwrapper = $('.ct-template_wrapper');
var ifh = iframe.height();
var ifw = iframe.width();
var grayscales = {};
var dweeks = constr_terms['ln-dweeks'];
var dweeks_short = constr_terms['ln-dweeks-short'];
var tmonths = constr_terms['ln-months'];
var tmonthsr = constr_terms['ln-months-rod'];
var tmonths_ln = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var template_config = {}


var tmonths_de = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
];

var image_fields = ['COVER_PHOTO', 'BRIDE_PHOTO', 'GROOM_PHOTO', 'TIMING_PHOTO', 'SPLASH', 'STORY_PHOTO', 'HELLO_PHOTO_ONE', 'LOCATION_PHOTO', 'PHOTO_ONE', 'TIMING_PHOTO', 'DATETIME_PHOTO_ONE', 'WISH_PHOTO_ONE', 'HELLO_PHOTO', 'TIMER_PHOTO_ONE', 'CONTACTS_PHOTO_ONE', 'ANKETA_PHOTO_ONE', 'BYE_PHOTO_ONE', 'BYE_PHOTO2_ONE'];  //Одно фото
var galleries = ['MAIN_GALLERY', 'DRESSCODE_GIRLS_GALLERY', 'DRESSCODE_GUYS_GALLERY', 'LOCATION_GALLERY', 'CONTACT_PHOTO'];  // галлереи в сетки
var gallery_items = ['MAIN_GALLERY_ITEMS', 'DRESSCODE_GIRLS_GALLERY_ITEMS', 'DRESSCODE_GUYS_GALLERY_ITEMS', 'LOCATION_GALLERY_ITEMS', 'HELLO_PHOTO_ITEMS', 'CONTACT_PHOTO_ITEMS', 'LOCATION_PHOTO_ITEMS', 'COVER_PHOTO_ITEMS', 'STORY_PHOTO_ITEMS', 'ANKETA_PHOTO_ITEMS', 'OWN_IMAGES', 'NEW_OWN_IMAGES'];  //Одиночные в галлереи
var text_items = ['WISH_TEXT_ITEMS', 'TIMING_1', 'TIMING_2', 'TIMING_3', 'TIMING_4', 'TIMING_DESC', 'ANKETA_DRINKS', 'LOCATION_TIMING'];

var ownBlockTemplate = '<section class="sm-own sm-edit" data-type="166" data-jsscroll="" data-jsscroll-slide-top=""><div class="sm-container"><div class="sm-own_wrapper"><div class="sm-own_wrapper-img"></div><h2 data-sm-text="OWN_TITLE" title=""></h2><div data-sm-text="OWN_TEXT" title="">{%OWN_TEXT%}</div><a data-sm-href="OWN_BUTTON_LINK" title="" class="sm-own_button" target="_blank"></a></div></div></section>';
var ownBlockTemplate2 = '<section class="sm-own sm-edit" data-type="211" data-jsscroll="" data-jsscroll-slide-top=""><div class="sm-container"><div class="sm-own_wrapper"><div class="sm-own_wrapper-img"></div><h2 data-sm-text="NEW_OWN_TITLE" title=""></h2><div data-sm-text="NEW_OWN_TEXT" title="">{%NEW_OWN_TEXT%}</div><a data-sm-href="NEW_OWN_BUTTON_LINK" title="" class="sm-own_button" target="_blank"></a></div></div></section>';

$(window).on('resize', function () {
    ifresize()
})
function ifresize() {

    tplwrapper.css('transform', 'scale(1)')
    iframe.css('transform', 'scale(1)').css('height', '100%').css('width', '100%').css('margin-top', 0).css('margin-left', 0);
    var ifh = 875;
    var ifw = 425;
    var mw = 390;

    if (!tplwrapper.hasClass('ct-iphone-wrapper')) {
        if($(window).innerWidth() > 768) {
            mw = 1920;
        }
        ifw = iframe.width();
        ifh = iframe.height();
    }

    var is1 = $('.ct-template_container').innerWidth() / mw
    var nifw = ifw / is1;
    var nifh = ifh / is1;
    var mt = (ifh - nifh) / 2
    var ml = (ifw - nifw) / 2
    if (!tplwrapper.hasClass('ct-iphone-wrapper')) {
        if($(window).innerWidth() <= 768) {
            nifw = Math.ceil(ifw / is1);
            nifh = Math.ceil(ifh / is1);
            mt = Math.ceil((ifh - nifh) / 2)
            ml = Math.ceil((ifw - nifw) / 2)
        }
        iframe.css('transform', 'scale(' + is1 + ')').css('height', nifh).css('width', mw).css('transform-origin', 'top, left').css('margin-top', mt).css('margin-left', ml)
    }
    else
    {
        is1 = $(window).innerHeight() / (885 * 1.4);
        nifw = ifw / is1;
        nifh = ifh / is1;
        mt = (ifh - nifh) / 2;
        ml = (ifw - nifw) / 2;

        $('.ct-iphone-wrapper').css('transform', 'scale(' + is1 + ')').css('transform-origin', 'center');

    }

    // setTimeout(function () {
    setFontSize();
    // }, 200);

}

ifresize();

$(function(){
    //&& d_email != ''
    if(d_groom != ''&& d_bride != ''  && d_mdate != '') {
        loadTemplateData()
    }

    $('.ct-toptap').click(function(){
        iframe.contents().find('html, body').stop().animate({ scrollTop: 0 }, 500);
    })
})

function doGrayscales()
{
    iframe.contents().find('[data-sm-src]').removeClass('sm-grayscale');

    $.each(grayscales,function(k,v){
        var name = v.name;
        var data = v.data;

        if($.inArray(name,gallery_items) !== -1)
        {
            if (data.length > 0) {
                $.each(data, function (ki, vi) {
                    iframe.contents().find('[data-sm-src="' + name + '_'+vi+'"]').addClass('sm-grayscale')
                })
            }
        }
        else {
            var i = iframe.contents().find('[data-sm-src="' + name + '"]');
            if (data.length > 0) {
                $.each(data, function (ki, vi) {
                    $(i[vi]).addClass('sm-grayscale');
                })
            }
        }
    })
}

function loadData(){
    $.post(ajax_url,{action:'loadData',project:project},function(data){
        if(data !== '') {
            var d = $.parseJSON(data);
            $.getJSON(d['data_file'], function (data) {
                if (data && data !== '') {
                    data_value = data;
                    data_value['GROOM'] = d_groom;
                    data_value['BRIDE'] = d_bride;
                    data_value['MAIN_DATE'] = d_mdate;
                    if(demo_view)
                    {
                        data_value['GROOM_TEL'] = '79268887788';
                        data_value['BRIDE_TEL'] = '79167778877';
                        data_value["CONTACTS_LINK"] = {"type" : "3","value" : "wedwed_russia"};
                    }
                    loadTemplate();
                }
            })
        }
        else
        {
            alert('Ошибка загрузки');
        }
    })
}

function loadTemplate(){
    console.log('loadedTemplate')
    $.each(data_value, function (ik, iv) {
        if(ik.split('_ALIGN').length > 0)
        {
            var target = ik.split('_ALIGN')[0];
            var targe = iframe.contents().find('[data-sm-text="' + target + '"]');
            targe.removeClass('sm-text_align-left').removeClass('sm-text_align-right').removeClass('sm-text_align-center').toggleClass('sm-text_align-' + iv, true);
        }
        if (ik === 'CONTACTS_LINK') {
            $('#secondPanel [name="contact_type"]').val(iv.type);
            $('#secondPanel [name="contact_link"]').val(iv.value);
            var link = 'tel:' + iv.value;

            if(iv.type == '2' && iv.value.indexOf('chat.whatsapp') > -1)
            {
                link = iv.value;
            }
            else
            {
                switch (Number(iv.type)) {
                    case 2:
                        link = 'https://wa.me/' + iv.value;
                        break;
                    case 3:
                        link = 'https://t.me/' + iv.value;
                        break;
                    case 4:
                        link = 'mailto:' + iv.value;
                        break;
                    case 5:
                        link = '';
                        break;
                }
            }

            iframe.contents().find('[data-sm-contact-mes]').attr('href',link.replace(/\s/g, ''));
        }

        if (ik === 'DRESSCODE_COLORS' || ik === 'DRESSCODE_COLORS_GUYS') {
            var va = '';
            $.each(iv, function (k, v) {
                va += '<div class="sm_colors"><div style="background: ' + v + '"></div></div>';
            })
            iv = va;
        }

        if ($.inArray(ik, image_fields) >= 0) {
            iv = '/sitemaker' + iv;
        }

        if ($.inArray(ik, galleries) >= 0) { //Картинки
            var photos = '';
            $.each(iv, function (ko, vo) {
                photos += '<img src="/sitemaker' + vo + '" data-fancybox="' + ik + '">';
            })
            iv = photos
        } else if ($.inArray(ik, text_items) >= 0) {
            $.each(iv, function (ko, vo) {
                iframe.contents().find('[data-sm-text="' + ik.toUpperCase() + '_' + ko + '"]').html(vo);
            })
        } else if ($.inArray(ik, gallery_items) >= 0) {

            var galleryItemReference = 0;

            if (ik.toUpperCase().indexOf('DRESSCODE') !== -1) {
                //пересобираем галерею дресс-кода если находим картинки и ни у одного родительского элемента не стоит класс sm-no-slider
                //на этом этапе находим референс слайда и удаляем все кроме первого
                if (iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '_' + 0 + '"]').length && !(iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '_' + 0 + '"]').closest('.sm-no-slider').length)) {
                    galleryItemReference = iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '_' + 0 + '"]')
                    if (galleryItemReference.closest('.js-sm-code-sliderOn').length || galleryItemReference.closest('.js-sm-code-sliderTw').length) {
                        galleryItemReference = galleryItemReference.closest('.sm-code__slider-al');
                        iframe.contents().find('[data-sm-href^="' + ik.toUpperCase() + '_"][data-sm-href!="' + ik.toUpperCase() + '_' + 0 + '"]').closest('.sm-code__slider-al').remove();
                    } else {
                        iframe.contents().find('[data-sm-href^="' + ik.toUpperCase() + '_"][data-sm-href!="' + ik.toUpperCase() + '_' + 0 + '"]').remove();
                    }
                }
            }

            $.each(iv, function (ko, vo) {
                if (ik.toUpperCase().indexOf('DRESSCODE') !== -1) {
                    //если определен референс, добавляем остальные слайды
                    if (!(iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '_' + ko + '"]').length) && galleryItemReference != 0) {
                        if (galleryItemReference.hasClass('sm-code__slider-al')) {
                            galleryItemReference.clone().appendTo(galleryItemReference.parent()).children('a').attr('data-sm-href', ik.toUpperCase() + '_' + ko).children('[data-sm-src="' + ik.toUpperCase() + '_' + 0 + '"]').attr('data-sm-src', ik.toUpperCase() + '_' + ko);
                        } else {
                            galleryItemReference.clone().appendTo(galleryItemReference.parent()).attr('data-sm-href', ik.toUpperCase() + '_' + ko).find('[data-sm-src="' + ik.toUpperCase() + '_' + 0 + '"]').attr('data-sm-src', ik.toUpperCase() + '_' + ko);
                        }
                    }
                }

                iframe.contents().find('[data-sm-src="' + ik.toUpperCase() + '_' + ko + '"]').prop('src', '/sitemaker' + vo);
                iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '_' + ko + '"]').prop('href', '/sitemaker' + vo);
            })
        }

        if (ik === 'ANKETA_DRINKS') {
            var drinks = iv;

            iframe.contents().find('div[data-sm-anketa] > *:not(.ct-alcotpl)').remove();

            if (drinks.length > 0) {
                $.each(drinks, function (k, v) {
                    var smanketa = iframe.contents().find('div[data-sm-anketa]');
                    if(smanketa.length > 0) {
                        $.each(smanketa,function(ka,va){
                            var tpl = $(this).find('.ct-alcotpl').clone();
                            tpl.removeClass('ct-alcotpl');
                            if(tpl.attr('tagName') === 'label'){
                                $(this).attr("for",'alco' + (k + 1));
                            }
                            else
                            {
                                tpl.find('label').attr("for",'alco' + (k + 1) + ka);
                            }

                            tpl.find('[data-sm-alcoitem]').text(v);
                            tpl.find('input').attr("id",'alco' + (k + 1) + ka).attr("value",(k + 1));
                            $(this).append(tpl);
                        })

                    }
                })
            }
        }

        var iv1 = '';
        var iv2 = '';
        var ivC = iv;

        if(iframe.contents().find('[data-sm-text="' + ik.toUpperCase() + '"]').length > 0)
        {
            ivC = iv.replace(/<\/?[^>]+(>|$)/g, "");
            iv = parseLinks(iv);
        }

        iframe.contents().find('[data-sm-text="' + ik.toUpperCase() + '"]').html(iv).attr('title', ivC);
        iframe.contents().find('[data-sm-date="' + ik.toUpperCase() + '"]').attr('data-date', iv).attr('title', ivC);

        if(ik == 'GROOM_TEL' || ik == 'BRIDE_TEL')
        {
            iv1 = phonePrepareView(iv);
            iv2 = phonePrepare(iv);
            if (iv != '') {
                iframe.contents().find('[data-sm-tel="' + ik.toUpperCase() + '"]').prop('href', 'tel:' + iv2).text('+' + iv1);
            }

            iframe.contents().find('[data-sm-tel="' + ik.toUpperCase() + '"]').toggleClass('sm-hidden', iv == '');
        }

        iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '"]').prop('href', iv).attr('target', '_blank');
        iframe.contents().find('[data-sm-src="' + ik.toUpperCase() + '"]').prop('src', iv);
    })

    iframe.contents().find('[data-sm-text="TIMING_1_1"]').parent().toggle(data_value['TIMING_1_1'] != '');

    var timing_wrappers = ['.sm-program__body li', '.sm-timing__item', '.sm-timing-item', '.sm-program__wrapper-item', '.sm-time__list-row', '.sm_times', '.sm-program__list-item', '.sm-program__cell'];

    $.each(timing_wrappers, function (k, v) {
        if (iframe.contents().find(v).length > 0) {
            $.each(iframe.contents().find(v), function (k, v) {
                $(this).toggleClass('sm-hidden', data_value['TIMING_' + (k + 1) + '_1'] == '' || data_value['TIMING_' + (k + 1) + '_0'] == '');
            })
        }
    })

    if(iframe.contents().find('[data-sm-text="ANKETA_DRINKS_QUESTION"]').length > 0 && iframe.contents().find('[data-sm-text="ANKETA_DRINKS_QUESTION"]').val() == '' && typeof(data_value['ANKETA_DRINKS_QUESTION']) == 'undefined')
    {
        iframe.contents().find('[data-sm-text="ANKETA_DRINKS_QUESTION"]').text('Ваши предпочтения');
    }

    iframe[0].contentWindow.initAll();

    // iframe.contents().find('[data-sm-anketa-toggle]').toggleClass('sm-hidden', d_alco == '0');
    iframe.contents().find('[data-sm-anketa-toggle] > [data-sm-text="ANKETA_DRINKS_QUESTION"]:not([data-forq])').toggleClass('sm-hidden', d_alco == '0');
    iframe.contents().find('[data-sm-anketa-toggle] [data-sm-anketa]:not([data-forq])').toggleClass('sm-hidden', d_alco == '0');

    var person_style = false;
    if (d_person != '') {
        if (iframe.contents().find('[data-sm-text="HELLO_TITLE"]').length > 0) {
            iframe.contents().find('[data-sm-text="HELLO_TITLE"]').text(d_person);
            person_style = true;
        } else if (iframe.contents().find('[data-sm-text="DATETIME_TITLE"]').length > 0 && iframe.contents().find('[data-sm-text="HELLO_TEXT"]').length == 0) {
            iframe.contents().find('[data-sm-text="DATETIME_TITLE"]').text(d_person);
            person_style = true;
        }
    }

    if (d_person_subtext != '') {
        if (iframe.contents().find('[data-sm-text="HELLO_SUBTITLE"]').length > 0) {
            iframe.contents().find('[data-sm-text="HELLO_SUBTITLE"]').html(d_person_subtext);
            person_style = true;
        }
    }

    if (d_person_text != '') {
        if (iframe.contents().find('[data-sm-text="HELLO_TEXT"]').length > 0) {
            iframe.contents().find('[data-sm-text="HELLO_TEXT"]').html(d_person_text);
            person_style = true;
        } else if (iframe.contents().find('[data-sm-text="DATETIME_TEXT"]').length > 0 && iframe.contents().find('[data-sm-text="HELLO_TEXT"]').length == 0 && iframe.contents().find('[data-sm-text="HELLO_TITLE"]').length == 0) {
            iframe.contents().find('[data-sm-text="DATETIME_TEXT"]').text(d_person_text);
            person_style = true;
        }
    }

    iframe.contents().find('body').toggleClass('sm-personal_linked', person_style);

    var sputnik = iframe.contents().find('[data-sm-anketa-company]');
    if (sputnik.parents('.sm-form__block').length > 0) {
        sputnik = sputnik.parents('.sm-form__block');
    } else if (sputnik.parents('.sm-form__input-wrapp').length > 0) {
        sputnik = sputnik.parents('.sm-form__input-wrapp');
    } else if (sputnik.parents('.sm-form__row').length > 0) {
        sputnik = sputnik.parents('.sm-form__row');
    } else if (sputnik.parents('.sm-wrapper_block-anketa_question').length > 0) {
        sputnik = sputnik.parents('.sm-wrapper_block-anketa_question');
    } else if (sputnik.parents('.sm-form-inner').length > 0) {
        sputnik = sputnik.parents('.sm-form-inner');
    } else if (sputnik.prev('.sm-mgb40').length > 0) {
        sputnik.prev('.sm-mgb40').toggleClass('sm-hidden', d_sput != '1')
    } else if (sputnik.prev('.text-20px').length > 0) {
        sputnik.prev('.text-20px').toggleClass('sm-hidden', d_sput != '1')
    } else if (sputnik.parents('.sm-questionnaire__form-inner').length > 0) {
        sputnik = sputnik.parents('.sm-questionnaire__form-inner');
    } else if (sputnik.parents('.sm-wrapper-input').length > 0) {
        sputnik = sputnik.parents('.sm-company_wrapper');
    }


    sputnik.toggleClass('sm-hidden', d_sput != '1');

    var palette = iframe.contents().find('[data-sm-text="DRESSCODE_COLORS"]');
    palette.toggle(d_palette == '1');

    iframe.contents().find('[data-sm-contact-bride]').toggle(data_value['BRIDE_TEL'] != '');
    iframe.contents().find('[data-sm-contact-groom]').toggle(data_value['GROOM_TEL'] != '');
    iframe.contents().find('[data-sm-href="LOCATION_MAP"]').toggle(data_value['LOCATION_MAP'] != '');

    iframe.contents().find('[data-sm-contact-mes]').attr('target', '_blank').toggle(data_value['CONTACTS_LINK'] && data_value['CONTACTS_LINK']['value'] != '');

    iframe.contents().find('[data-sm-href="WISH_WISHLIST"]').toggle(data_value['WISH_WISHLIST'] && data_value['WISH_WISHLIST'] != '' && data_value['WISH_WISHLIST'] != 'https://ohmywishes.com/users/wedding-09.09.2025');

    for (var w = 0; w < 3; w++) {
        if (data_value['WISH_TEXT_ITEMS_' + w] == '') {
            if (iframe.contents().find('[data-sm-text="WISH_TEXT_ITEMS_' + w + '"]').parents('.sm-wishes__content-item').length > 0) {
                iframe.contents().find('[data-sm-text="WISH_TEXT_ITEMS_' + w + '"]').parents('.sm-wishes__content-item').remove();
            } else {
                iframe.contents().find('[data-sm-text="WISH_TEXT_ITEMS_' + w + '"]').remove();
            }
        }
    }


    if (iframe.contents().find('[data-sm-text="MAIN_TIMING"]').length > 0) {
        if (typeof (data_value['MAIN_TIMING']) == 'undefined') {
            iframe.contents().find('[data-sm-text="MAIN_TIMING"]').parent().toggle(data_value['TIMING_1_0'] != '');
            iframe.contents().find('.sm-date-slash').toggle(data_value['TIMING_1_0'] != '');
            iframe.contents().find('[data-sm-text="MAIN_TIMING"]').html(data_value['TIMING_1_0'])
        } else {
            iframe.contents().find('[data-sm-text="MAIN_TIMING"]').toggle(data_value['MAIN_TIMING'] != '');
            iframe.contents().find('.sm-date-slash').toggle(data_value['MAIN_TIMING'] != '');
        }
    }

    if (iframe.contents().find('[data-sm-text="LOCATION_TIMING_0"]').length > 0) {
        if (typeof (data_value['LOCATION_TIMING']) == 'undefined' && typeof (data_value['LOCATION_TIMING_0']) == 'undefined') {
            iframe.contents().find('[data-sm-text="LOCATION_TIMING_0"]').parent().toggle(data_value['TIMING_1_0'] != '');
            iframe.contents().find('[data-sm-text="LOCATION_TIMING_0"]').html(data_value['TIMING_1_0'])

            iframe.contents().find('[data-sm-text="LOCATION_TIMING_1"]').parent().toggle(data_value['TIMING_1_1'] != '');
            iframe.contents().find('[data-sm-text="LOCATION_TIMING_1"]').html(data_value['TIMING_1_1'])
        } else {
            iframe.contents().find('[data-sm-text="LOCATION_TIMING_0"]').parent().toggleClass('sm-hidden', data_value['LOCATION_TIMING_0'] == '');
            iframe.contents().find('[data-sm-text="LOCATION_TIMING_0"]').html(data_value['LOCATION_TIMING_0'])

            iframe.contents().find('[data-sm-text="LOCATION_TIMING_1"]').parent().toggleClass('sm-hidden', data_value['LOCATION_TIMING_0'] == '');
            iframe.contents().find('[data-sm-text="LOCATION_TIMING_1"]').html(data_value['LOCATION_TIMING_1'])
        }
    }


    var nd = d_mdate.split('.');
    if (nd.length >= 3) {
        var pyear = nd[2];
        var pmonth = Number(nd[1]);
        var pday = nd[0];
    }

    var bd = d_bdate.split('.');
    if (bd.length >= 3) {
        var byear = bd[2];
        var bmonth = Number(bd[1]);
        var bday = bd[0];
    }

    var pweek = new Date(pyear, pmonth - 1, pday).getDay()
    var emonth = new Date(pyear, pmonth - 1, pday).toLocaleString('default', {month: 'long'});

    iframe.contents().find('[data-sm-bmonth-rod]').html(tmonthsr[bmonth - 1]);
    iframe.contents().find('[data-sm-tmonth-rod]').html(tmonthsr[pmonth - 1]);
    iframe.contents().find('[data-sm-tmonth]').html(tmonths[pmonth - 1]);
    iframe.contents().find('[data-sm-wday]').html(dweeks[pweek]);
    iframe.contents().find('[data-sm-fyear]').html(pyear);

    if (pmonth < 10) {
        pmonth = '0' + pmonth;
    }
    if (pyear > 2000) {
        pyear = pyear.substring(2, 4);
    }

    if (bmonth < 10) {
        bmonth = '0' + bmonth;
    }
    if (byear > 2000) {
        byear = byear.substring(2, 4);
    }


    iframe.contents().find('[data-sm-year]').html(pyear);
    iframe.contents().find('[data-sm-day]').html(pday);
    iframe.contents().find('[data-sm-lnmonth]').html(tmonths_ln[pmonth - 1]);
    iframe.contents().find('[data-sm-demonth]').html(tmonths_de[pmonth - 1]);
    iframe.contents().find('[data-sm-emonth]').html(emonth);
    iframe.contents().find('[data-sm-month]').html(pmonth);

    iframe.contents().find('[data-sm-byear]').html(byear);
    iframe.contents().find('[data-sm-bday]').html(bday);
    iframe.contents().find('[data-sm-bmonth]').html(bmonth);

    if(iframe.contents().find('[data-sm-text="DRESSCODE_COLORS"]').length > 1)
    {
        var dc = iframe.contents().find('[data-sm-text="DRESSCODE_COLORS"]');
        var sc = $(dc[0]).find('.sm_colors').clone();
        var pc = (sc.length / dc.length);
        $.each(dc,function(k,v)
        {
            $(this).html('');
            for (var c = 0; c < pc; c++) {
                $(this).append(sc[c + k * pc]);
            }
        })
    }

    doGrayscales();

    setTimeout(function () {
        initTimingIcons();
        setFontSize();
    }, 500)


    initVideo();
    if(typeof fillQuests !== "undefined" && iframe.contents().find('.ct-addquests_wrapper').length === 0)
    {
        $.post(ajax_url,{action:'loadQuestionsView',project:project},function(data) {
            if (data != '') {
                template_val.questions = $.parseJSON(data);
                if (template_val.questions && template_val.questions.length > 0) {
                    var smb = iframe.contents().find('[data-sm-anketa-toggle]');
                    var ins = '';
                    if (smb.find('.sm-form_preferences').length > 0) {
                        ins = ' > .sm-form_preferences';
                    }
                    $.each(template_val.questions, function (k, v) {
                        var forqu = 'quest-' + v.id;
                        if (smb.length > 0) {
                            $.each(smb, function (ko, vo) {
                                var smbt = $(smb.find('div')[0]).clone();

                                if (smb.parent().find('[data-sm-anketa-toggle]' + ins + ' > label').length > 0) {
                                    smbt = $(smb.find('label')[0]).clone();
                                } else if (smb.parent().find('[data-sm-anketa-toggle]' + ins + ' > p').length > 0) {
                                    smbt = $(smb.find('p')[0]).clone();
                                }

                                var smbc = $(smb.find('[data-sm-anketa]')[0]).clone();
                                var smbb = $(smb.find('.ct-alcotpl')[0]).clone();

                                smbt.removeAttr('data-sm-text');
                                // smbt.attr('data-forq',forqu )
                                // smbc.attr('data-forq',forqu );
                                smbt.attr('data-forq', forqu)
                                smbc.attr('data-forq', forqu);

                                $(this).append(smbt);
                                $(this).append(smbc);

                                var titl = $(this).find('[data-forq="' + forqu + '"]:not([data-sm-anketa])');

                                while (titl.children().length) {
                                    titl = titl.children();
                                }

                                $(titl[0]).html(v.question);

                                var drinks = $(this).find('[data-sm-anketa][data-forq="' + forqu + '"]');
                                var tn = drinks.find('.ct-alcotpl').prop("tagName");
                                drinks.find(tn + ':not(.ct-alcotpl)').remove();

                                $.each(v.answers, function (ka, va) {
                                    var smbd = smbb.clone();
                                    drinks.append(smbd)
                                    var chb = $(drinks.find('.ct-alcotpl')[ka]);
                                    chb.find('input').val(va.id).attr('name', forqu + '[]').attr('id', forqu + '-' + ko + '_' + va.id);
                                    if (chb.find('[data-sm-alcoitem]').parents('label').length == 0) {
                                        chb.find('[data-sm-alcoitem]').attr('for', forqu + '-' + ko + '_' + va.id).html(va.answer);
                                    } else {
                                        chb.find('[data-sm-alcoitem]').parents('label').attr('for', forqu + '-' + ko + '_' + va.id)
                                        chb.find('[data-sm-alcoitem]').html(va.answer);
                                    }
                                })

                                console.log('vt: ' + v.type)
                                if (typeof v.type != 'undefined' && v.type == '1') {
                                    var smbi = iframe.contents().find('[data-sm-anketa-name]')[0];
                                    var smbd = $(smbi).clone();
                                    drinks.append(smbd)
                                    var inp = drinks.find('[data-sm-anketa-name]');
                                    inp.attr('name', forqu).attr('id', forqu + '_' + ko).attr('placeholder', 'Ваш ответ').removeAttr('data-sm-anketa-name');
                                }

                                smbb.remove();
                                drinks.find('.ct-alcotpl [name="alco[]"]').parents('.ct-alcotpl').remove();
                                drinks.find('.ct-alcotpl').removeClass('ct-alcotpl');
                                iframe.contents().find('[data-sm-anketa-toggle]').removeClass('sm-hidden');
                                iframe.contents().find('[data-forq]').removeClass('sm-hidden');
                            })
                        }
                    })
                }
                questfilled = true;
            }
        })
    }



    if(typeof data_value['OWN_IMAGES'] == 'undefined')
    {
        data_value['OWN_IMAGES'] = [];
    }

    if(typeof data_value['OWN_TITLE'] == 'undefined')
    {
        data_value['OWN_TITLE'] = 'Заголовок';
    }

    if(typeof data_value['OWN_COLORS'] == 'undefined')
    {
        data_value['OWN_COLORS'] = ['#ffffff','#000000'];
    }

    if(typeof data_value['OWN_TEXT'] == 'undefined')
    {
        data_value['OWN_TEXT'] = 'Текст';
    }

    // if(typeof data_value['OWN_ALIGN'] == 'undefined')
    // {
    data_value['OWN_ALIGN'] = 1;
    //}

    if(typeof data_value['OWN_AFTER'] == 'undefined')
    {
        data_value['OWN_AFTER'] = 0;
    }

    var newowned = false;

    if (data_value['OWN_AFTER'] > 0) {
        if (data_value['NEW_OWN_AFTER'] && data_value['NEW_OWN_AFTER'] > 0 && data_value['OWN_AFTER'] == '211') {
            iframe.contents().find('[data-type="' + data_value['NEW_OWN_AFTER'] + '"]').after(ownBlockTemplate2);
            newowned = true;
        }
        iframe.contents().find('[data-type="' + data_value['OWN_AFTER'] + '"]').after(ownBlockTemplate);
    }

    if (!newowned && data_value['NEW_OWN_AFTER'] && data_value['NEW_OWN_AFTER'] > 0) {
        iframe.contents().find('[data-type="' + data_value['NEW_OWN_AFTER'] + '"]').after(ownBlockTemplate2);
    }

    var ownblocks = [166, 211];
    $.each(ownblocks, function (k, v) {
        var add = '';
        var addb = '';
        var n = v;
        if (n == '211') {
            add = 'NEW_';
            addb = 'new_';
        }
        if (data_value[add + 'OWN_AFTER'] && data_value[add + 'OWN_AFTER'] != '0') {
            iframe.contents().find('[data-sm-text="' + add + 'OWN_TITLE"]').text(data_value[add + 'OWN_TITLE']).toggleClass('sm-hidden', (data_value[add + 'OWN_TITLE'] === '')).css('color', data_value[add + 'OWN_COLORS'][1]);
            iframe.contents().find('[data-sm-text="' + add + 'OWN_TEXT"]').html(parseLinks(data_value[add + 'OWN_TEXT'])).toggleClass('sm-hidden', (data_value[add + 'OWN_TEXT'] === '')).css('color', data_value[add + 'OWN_COLORS'][1]);
            iframe.contents().find('.sm-own[data-type="' + n + '"]').attr('data-position', data_value[add + 'OWN_ALIGN']).css('background-color', data_value[add + 'OWN_COLORS'][0]);

            own_images = '';

            if (data_value[add + 'OWN_IMAGES'].length > 0) {
                $.each(data_value[add + 'OWN_IMAGES'], function (key, val) {
                    own_images += '<img src="/sitemaker/' + val + '" data-sm-src="' + add + 'OWN_IMAGES_' + key + '">';
                })
            }

            if (typeof (data_value[add + 'OWN_BUTTON_LINK']) != 'undefined' && data_value[add + 'OWN_BUTTON_LINK'] != '') {
                var cl = iframe.contents().find('[data-sm-href="LOCATION_MAP"]').attr('class');
                iframe.contents().find('[data-sm-href="' + add + 'OWN_BUTTON_LINK"]').attr('href', data_value[add + 'OWN_BUTTON_LINK']).attr('class', cl).html(data_value[add + 'OWN_BUTTON_TITLE']).removeClass('open-modal');
            }

            iframe.contents().find('[data-sm-href="' + add + 'OWN_BUTTON_LINK"]').toggleClass('sm-hidden', typeof (data_value[add + 'OWN_BUTTON_LINK']) == 'undefined' || data_value[add + 'OWN_BUTTON_LINK'] == '')

            iframe.contents().find('.sm-own[data-type="' + n + '"] .sm-own_wrapper-img').html(own_images).toggleClass('sm-hidden', (data_value[add + 'OWN_IMAGES'].length === 0));

            // if (data_value[add + 'OWN_IMAGES'].length > 1) {
            //
            // }
        }
        reInitOwnBlock(add);

    });



    // var flt = 0;
    // var llt = 0;
    // var tlt = 0;
    // var lt = iframe.contents().find('[data-sm-text="LOCATION_TITLE"]');
    // if(lt.length > 0)
    //     {flt = lt.css('font-size'); llt = lt.css('line-height'); tlt = lt.css('font-family'); trlt = lt.css('text-transform');}
    // if(flt != '0') {
    //     iframe.contents().find('[data-sm-text="OWN_TITLE"]').css({'font-family': tlt, 'font-size': flt,'line-height': llt,'text-transform':trlt});
    // }

    var buts = {};
    buts['location_map'] = 'Как добраться'
    buts['wish_wishlist'] = 'Список подарков'
    buts['contact_link'] = 'Связаться';

    $.each(buts, function (k, v) {
        if (data_value[k.toUpperCase() + '_BUTTON_TITLE'] && data_value[k.toUpperCase() + '_BUTTON_TITLE'] != '') {
            iframe.contents().find('[data-sm-href="' + k.toUpperCase() + '"]').text(data_value[k.toUpperCase() + '_BUTTON_TITLE'])
        } else {
            iframe.contents().find('[data-sm-href="' + k.toUpperCase() + '"]').text(v)
        }
    })

    var sects = iframe.contents().find('[data-type]');

    $.each(sects, function (k, v) {
        var ds = $(this).attr('data-type');
        var csstext = '';
        if (data_value['PERSONAL_COLORS[' + ds + ']'] && data_value['PERSONAL_COLORS[' + ds + ']'] != '') {
            $(this).css('background', data_value['PERSONAL_COLORS[' + ds + ']']);
            if (iframe.contents().find('.sm-template47').length > 0) {
                if (ds != 2 && ds != 7) {
                    csstext = 'background:' + data_value['PERSONAL_COLORS[' + ds + ']'] + ' !important;';
                    $(this).find('h2 span').css('cssText', 'background:' + data_value['PERSONAL_COLORS[' + ds + ']'] + ' !important');
                }
            }
            $(this).toggleClass('sm-painted', true)
        }
        if (data_value['PERSONAL_COLORS_FONT[' + ds + ']'] && data_value['PERSONAL_COLORS_FONT[' + ds + ']'] != '') {
            $(this).css('color', data_value['PERSONAL_COLORS_FONT[' + ds + ']'])
            iframe.contents().find('[data-type="' + ds + '"] *:not(.sm_colors):not(.sm_color > div):not(.sm-btn):not(.sm-button):not(.sm-button-center):not(.sm_colors *)').css('cssText', 'color:' + data_value['PERSONAL_COLORS_FONT[' + ds + ']'] + ' !important');
            if (iframe.contents().find('.sm-template47').length > 0) {
                if (ds != 2 && ds != 7) {
                    $(this).find('h2 span').css('cssText', csstext + 'color:' + data_value['PERSONAL_COLORS_FONT[' + ds + ']'] + ' !important');
                }
            }
            $(this).toggleClass('sm-painted_text', true)
        }


        var pseudo = $(this).find('[class*="__bg"]');
        if (pseudo.length > 0) {
            pseudo.css('cssText', 'background:' + $(this).val() + ' !important');
        }


    })


    if (iframe.contents().find('.sm-questionnaire.sm-painted_text').length > 0) {
        var cl = iframe.contents().find('.sm-questionnaire.sm-painted_text').css('color');
        iframe.contents().find('.sm-modal *:not(.sm_colors):not(.sm_color > div):not(.sm-btn):not(.sm-button):not(.sm-button-center):not(.sm_colors *)').css('cssText', 'color:' + cl + ' !important');
    }

}


function phonePrepare(phone){
    if(phone != '')
    {
        $('body').append('<div class="ct-tmp">'+phone+'</div>')
        phone = $('.ct-tmp').text().replace(/\s/g, '').replace('-','').replace('+', '').replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1$2$3$4$5');;
        $('.ct-tmp').remove();
    }
    return phone;
}

function phonePrepareView(phone){
    if(phone != '')
    {
        let cleaned = ('' + phone).replace(/\D/g, '');
        let match = cleaned.match(/^(7|)?(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            let intlCode = (match[1] ? '7 ' : '')
            if (iframe.contents().find('.sm-template97').length > 0) {
                return [intlCode, ' ', match[2], ' ', match[3], '-', match[4], '-', match[5]].join('')
            } else {
                return [intlCode, '(', match[2], ') ', match[3], '-', match[4], '-', match[5]].join('')
            }
        }
    }
    return phone;
}

function parseLinks(text) {
    // return text;
    if ($.isArray(text)) {
        return text;
    }
    if (/<a\s+[^>]*href=["'].*?["'].*?>.*?<\/a>/i.test(text)) {
        return text.replace(/<a\s+([^>]*?)>/gi, function (match, p1) {
            p1 = p1.replace(/\s*target\s*=\s*['"][^'"]*['"]/i, '');
            return `<a ${p1} target="_blank" rel="noopener noreferrer">`;
        });
    }

    const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/g;
    return text.replace(urlRegex, (url) => {
        const href = url.startsWith('http') ? url : `http://${url}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
}

function loadTemplateData(){
    $.post(ajax_url,{action:'loadTemplateData',project:project},function(data){
        if(data !== '' && data !== 'false') {
            var d = $.parseJSON(data);
            template_val = d;
            iframe.prop('src', loader);
            $(iframe).on('load',function(){
                loadData();
            })
            if(template_val.offsections && template_val.offsections != '') {
                offsections = $.parseJSON(template_val.offsections);
            }
            else
            {
                offsections = [];
            }

            if(template_val.grayscales && template_val.grayscales != '') {
                grayscales = $.parseJSON(template_val.grayscales);
            }
            else
            {
                grayscales = [];
            }
        }
        else
        {
            alert('Некорректные данные')
        }
    })
}


function initTimingIcons() {

    $.getJSON('/sitemaker/templates/' + template_val.folder + '/config.json', function (data) {
        if (data) {
            template_config = data;
            setIcons();
        }
    }).fail(function () {

    })
}


function setIcons() {
    $.each(iframe.contents().find('[data-sm-text^="TIMING_"'), function (k, v) {

        var par = $(this).parents(template_config['TIMING_ITEM_CONTAINER']);
        var i = $(this).attr('data-sm-text').split('_');

        if (typeof data_value['TIMING_' + i[1] + '_I'] != 'undefined' && data_value['TIMING_' + i[1] + '_I'] != '') {
            if (template_config['TIMING_ICON_TYPE'] == '2') {
                var im = par.find('img');
                if (typeof par.attr('data-default') == 'undefined' || par.attr('data-default') == '') {
                    par.attr('data-default', im.attr('src'));
                }
                im.attr('src', data_value['TIMING_' + i[1] + '_I'])
            } else if (template_config['TIMING_ICON_TYPE'] == '1') {
                $.get(data_value['TIMING_' + i[1] + '_I'], function (data) {
                    var im = par.find('svg');

                    if (typeof par.attr('data-default') == 'undefined' || par.attr('data-default') == '') {
                        par.attr('data-default', $(im[0]).prop('outerHTML'));
                    }

                    var svgElement = $(data).find('svg');
                    $(im[0]).replaceWith(svgElement)
                }, 'xml');
            }
        }
    })
}

function setFontSize() {
    var ic = iframe.contents()
    var fs = ic.find('[data-sm-text="LOCATION_TITLE"]').css('font-size');
    var fw = ic.find('[data-sm-text="LOCATION_TITLE"]').css('font-weight');
    var tfs = ic.find('[data-sm-text="LOCATION_TEXT"]').css('font-size');
    var tfw = ic.find('[data-sm-text="LOCATION_TEXT"]').css('font-weight');

    if (ic.find('.sm-template13').length > 0 || ic.find('.sm-template69').length > 0) {
        fs = ic.find('[data-sm-text="LOCATION_SUBTITLE"]').css('font-size');
        fw = ic.find('[data-sm-text="LOCATION_SUBTITLE"]').css('font-weight');
    }

    ic.find('[data-sm-text="OWN_TITLE"], [data-sm-text="NEW_OWN_TITLE"]').css({'font-size': fs, 'font-weight': fw});
    ic.find('[data-sm-text="OWN_TEXT"],[data-sm-text="NEW_OWN_TEXT"]').css({'font-size': tfs, 'font-weight': tfw});
}

//
// function addQuest() {
//     var colq = $('.ct-addquest_tools.active').length + 1;
//     console.log(colq)
//     var str = new RegExp('{%QID%}')
//     var re = new RegExp(str, 'g');
//     var bltpl1 = bltpl.replace(re, colq);
//     $('.ct-addquests_wrapper').append(bltpl1);
//
//
//     recalcOrderQuest();
// }
//
function fillQuests() {
    if (template_val.questions && template_val.questions.length > 0) {
        var smb = iframe.contents().find('[data-sm-anketa-toggle]');
        var ins = '';
        if (smb.find('.sm-form_preferences').length > 0) {
            ins = ' > .sm-form_preferences';
        }

        $.each(template_val.questions, function (k, v) {
            var forqu = 'quest-' + v.id;
            var qu = $('.ct-panel_header[for="' + forqu + '"]').parents('.ct-addquests-item');
            var co = qu.find('.ct-hidden_wrapper');

            qu.find('[name="' + forqu + '_answer[]"]').parents('.ct-input_wrapper').remove();
            qu.find('[name="' + forqu + '_question"]').val(v.question);
            if (typeof v.type != 'undefined') {
                qu.find('#' + forqu + '-type li[data-type="' + v.type + '"]').click();
                qu.find('#' + forqu + '-type').removeClass('active');
            }
            if (smb.length > 0) {
                $.each(smb, function (ko, vo) {
                    var sorname = forqu + '-' + ko
                    if (typeof setPrice == 'undefined') {
                        sorname = forqu
                    }
                    var smbt = $(smb.find('div')[0]).clone();

                    if (smb.parent().find('[data-sm-anketa-toggle]' + ins + ' > label').length > 0) {
                        smbt = $(smb.find('label')[0]).clone();
                    } else if (smb.parent().find('[data-sm-anketa-toggle]' + ins + ' > p').length > 0) {
                        smbt = $(smb.find('p')[0]).clone();
                    }

                    var smbc = $(smb.find('[data-sm-anketa]')[0]).clone();
                    var smbb = $(smb.find('.ct-alcotpl')[0]).clone();

                    smbt.attr('data-forq', sorname)
                    smbc.attr('data-forq', sorname);

                    $(this).append(smbt);
                    $(this).append(smbc);

                    var titl = iframe.contents().find('[data-forq="' + sorname + '"]:not([data-sm-anketa])');
                    while (titl.children().length) {
                        titl = titl.children();
                    }

                    $(titl[0]).html(v.question);
                    var drinks = iframe.contents().find('[data-sm-anketa][data-forq="' + sorname + '"]');
                    var tn = drinks.find('.ct-alcotpl').prop("tagName");
                    drinks.find(tn + ':not(.ct-alcotpl)').remove();

                    $.each(v.answers, function (ka, va) {
                        var sornamek = sorname + '_' + (ka + 1)
                        var sornamev = va;
                        if (typeof setPrice == 'undefined') {
                            sornamek = sorname + '_' + (va.id)
                            sornamev = va.answer
                        }
                        var smbd = smbb.clone();
                        drinks.append(smbd)
                        var chb = $(drinks.find('.ct-alcotpl')[ka]);

                        chb.find('input').val(ka + 1).attr('name', sorname + '[]').attr('id', sornamek);
                        chb.find('[data-sm-alcoitem]').attr('for', sornamek).html(sornamev);
                    })

                    if (typeof v.type != 'undefined' && v.type == '1') {
                        var smbi = iframe.contents().find('[data-sm-anketa-name]')[0];
                        var smbd = $(smbi).clone();
                        drinks.append(smbd)
                        var inp = drinks.find('[data-sm-anketa-name]');
                        inp.attr('name', sorname).attr('id', sorname).attr('placeholder', 'Ваш ответ').removeAttr('data-sm-anketa-name');
                    }

                    smbb.remove();
                    drinks.find('.ct-alcotpl [name="alco[]"]').parents('.ct-alcotpl').remove();
                    drinks.find('.ct-alcotpl').removeClass('ct-alcotpl');
                })
                iframe.contents().find('[data-sm-anketa-toggle]').removeClass('sm-hidden');
                iframe.contents().find('[data-forq]').removeClass('sm-hidden');
            }
            if (v.answers.length > 0) {
                $.each(v.answers, function (ka, va) {
                    var fornam = forqu + '_answer[]';
                    var fornav = va
                    if (typeof setPrice == 'undefined') {
                        fornam = forqu + '_' + va.id + '_answer';
                        fornav = va.answer;
                    }
                    co.find('.ct-input-dynamic_multiplier').before('<div class="ct-input_wrapper ct-input-dynamic"><div class="ct-input_wrapper-item"><label class="ct-input_label">Вариант ответа <span>' + (ka + 1) + '</span></label><input type="text" class="ct-input ct-input_answer" placeholder="Вариант ответа" name="' + fornam + '" value="' + fornav + '"></div><div class="ct-input_remover"></div></div>');
                })
            } else {
                co.find('.ct-input-dynamic_multiplier').before('<div class="ct-input_wrapper ct-input-dynamic ct-hidden"><div class="ct-input_wrapper-item"><label class="ct-input_label">Вариант ответа <span>1</span></label><input type="text" class="ct-input" placeholder="Вариант ответа" name="' + forqu + '_answer[]" value=""></div><div class="ct-input_remover"></div></div>');
            }
        })
    }
    questfilled = true;
}


function initVideo() {
    var vis = iframe.contents().find('[data-sm-video]');

    if (vis.length > 0) {
        if (typeof data_value['HEAD_VIDEO'] != 'undefined' && data_value['HEAD_VIDEO'] != '') {
            var hv = data_value['HEAD_VIDEO'].replace('/tmp/', '/' + project + '/');
            $.each(iframe.contents().find('[data-sm-video]'), function () {
                $(this).attr('src', hv);
                $(this).parent().css('filter', 'none');
                $(this).parents('video')[0].load();
            });
        }
    } else {
        console.log('novideo')
    }
}


function reInitOwnBlock(v = '') {
    if (typeof data_value[v + 'OWN_GALLERY_TYPE'] == 'undefined' || data_value[v + 'OWN_GALLERY_TYPE'] == '') {
        data_value[v + 'OWN_GALLERY_TYPE'] = 0;
    }

    if (typeof data_value[v + 'OWN_VIDEO'] == 'undefined' || data_value[v + 'OWN_GALLERY_TYPE'] != 6) {
        data_value[v + 'OWN_VIDEO'] = '';
    }
    /* Это видео */
    console.log(data_value[v + 'OWN_GALLERY_TYPE']);
    if (data_value[v + 'OWN_GALLERY_TYPE'] == 6) {
        initOwnVideo(v + 'OWN');
    }

    iframe.contents().find('[data-type="' + ((v == '') ? '166' : '211') + '"] .sm-own_wrapper-img').attr('data-asp', data_value[v + 'OWN_GALLERY_TYPE']);

    if (typeof data_value[v + 'OWN_COLORS'][2] == 'undefined') {
        data_value[v + 'OWN_COLORS'][2] = '#ffffff'; //button text
        data_value[v + 'OWN_COLORS'][3] = '#000000'; //button back
        data_value[v + 'OWN_COLORS'][4] = '#000000'; //button bord
    }

    iframe[0].contentWindow.ownSlick();
}


function initOwnVideo(v) {

    var ic = iframe.contents();
    ic.find('[data-sm-text="' + v + '_TITLE"]').parents('.sm-own').find('.sm-video_wrapper').remove();

    if (typeof data_value[v + '_VIDEO'] != 'undefined' && data_value[v + '_VIDEO'] != '') {


        var vid = '<video playsInline class="sm-own_video" id="sm-' + v.toLowerCase() + '_video"><source type="video/mp4" src="' + data_value[v + '_VIDEO'] + '#t=0.1"/></video>';
        ic.find('[data-sm-text="' + v + '_TITLE"]').after('<div class="sm-video_wrapper">' + vid + '</div>')
        ic.find('.sm-video_wrapper').off('click').on('click', function () {
            var vid = $(this).find('video');
            if (vid[0].paused) {
                vid[0].play();
            } else {
                vid[0].pause();
            }
        });

        ic.find('#sm-' + v.toLowerCase() + '_video').off('play pause loadeddata').on('play pause loadeddata', function () {
            var that = $(this)
            setTimeout(function () {
                that.parent().toggleClass('paused', that.paused);
            }, 300)

        })
    }
}