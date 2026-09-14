/******************************************************************************\
# JS - script                                    #       Maximum Tension       #
################################################################################
#                                                #      -__            __-     #
# Teoman Deniz                                   #  :    :!1!-_    _-!1!:    : #
# maximum-tension.com                            #  ::                      :: #
#                                                #  :!:    : :: : :  :  ::::!: #
# +.....................++.....................+ #   :!:: :!:!1:!:!::1:::!!!:  #
# : C - Maximum Tension :: Create - 2026/09/12 : #   ::!::!!1001010!:!11!!::   #
# :---------------------::---------------------: #   :!1!!11000000000011!!:    #
# : License - MIT       :: Update - 2026/09/12 : #    ::::!!!1!!1!!!1!!!::     #
# +.....................++.....................+ #       ::::!::!:::!::::      #
\******************************************************************************/
const body=DOM.GET.ID("body");const header=DOM.GET.ID("header");const form_name=DOM.GET.ID("form_name");const form_phone=DOM.GET.ID("form_phone");const form_email=DOM.GET.ID("form_email");const form_group=DOM.GET.ID("form_group");const form_message=DOM.GET.ID("form_message");const form_whatsapp_link=DOM.GET.ID("form_whatsapp_link");const year_date=DOM.GET.ID("year_date");const whatsapp_number="905442648314";const mobile_width=980;const scroll_limit=30;const gallery_delay=5000;const reveal_duration=700;var gallery_slides=[];var gallery_dots=[];var gallery_index=0;var gallery_timer=null;function
to_array(collection){return(Array.prototype.slice.call(collection));}function
whatsapp_url(message){return("https://wa.me/"+whatsapp_number+"?text="+encodeURIComponent(message));}function
value_or_dash(value){if(value.length===0)return("-");return(value);}function
on_scroll(){const scroll_y=window.scrollY||window.pageYOffset||0;if(scroll_y>scroll_limit)DOM.CLASS.ADD(header,"scrolled");else
DOM.CLASS.REMOVE(header,"scrolled");}function
on_resize(){if(window.innerWidth>=mobile_width)close_menu();}function
toggle_menu(){if(DOM.CLASS.CHECK(body,"menu_open"))DOM.CLASS.REMOVE(body,"menu_open");else
DOM.CLASS.ADD(body,"menu_open");}function
close_menu(){DOM.CLASS.REMOVE(body,"menu_open");}function
show_gallery_slide(index){const count=gallery_slides.length;if(count===0)return;gallery_index=((index%count)+count)%count;JS.ITERATE(gallery_slides,function(slide,slide_index){if(slide_index===gallery_index)DOM.CLASS.ADD(slide,"active");else
DOM.CLASS.REMOVE(slide,"active");});JS.ITERATE(gallery_dots,function(dot,dot_index){if(dot_index===gallery_index)DOM.CLASS.ADD(dot,"active");else
DOM.CLASS.REMOVE(dot,"active");});}function
next_gallery_slide(){show_gallery_slide(gallery_index+1);}function
start_gallery_timer(){if(gallery_timer!==null){clearInterval(gallery_timer);gallery_timer=null;}if(gallery_slides.length>1)gallery_timer=setInterval(next_gallery_slide,gallery_delay);}function
go_gallery(index){show_gallery_slide(index);start_gallery_timer();}function
finish_reveal(element){DOM.CLASS.REMOVE(element,"reveal_pending");DOM.CLASS.REMOVE(element,"reveal_visible");element.style.transitionDelay="";}function
reveal_element(element){const delay=parseFloat(element.style.transitionDelay)||0;DOM.CLASS.ADD(element,"reveal_visible");setTimeout(function(){finish_reveal(element);},reveal_duration+(delay*1000)+100);}function
prepare_reveal(){const elements=to_array(DOM.GET.CLASS("reveal"));var observer;if(!("IntersectionObserver"in window))return;observer=new IntersectionObserver(function(entries){JS.ITERATE(entries,function(entry){if(!entry.isIntersecting)return;observer.unobserve(entry.target);reveal_element(entry.target);});},{threshold:0.12,rootMargin:"0px 0px -8% 0px"});JS.ITERATE(elements,function(element,index){DOM.CLASS.ADD(element,"reveal_pending");element.style.transitionDelay=((index%6)*0.06)+"s";observer.observe(element);});}function
update_whatsapp_links(){const url=whatsapp_url(strings[0]);JS.ITERATE(to_array(DOM.GET.CLASS("whatsapp_link")),function(link){link.href=url;});}function
update_form_link(){const message=strings[0]+JS.TEMPLATE(strings[1],{name:value_or_dash(form_name.value),phone:value_or_dash(form_phone.value),email:value_or_dash(form_email.value),group:value_or_dash(form_group.value),message:value_or_dash(form_message.value)});form_whatsapp_link.href=whatsapp_url(message);}function
main(){gallery_slides=to_array(DOM.GET.CLASS("hero_slide"));gallery_dots=to_array(DOM.GET.CLASS("hero_dot"));update_whatsapp_links();update_form_link();prepare_reveal();show_gallery_slide(0);start_gallery_timer();window.addEventListener("scroll",on_scroll,{passive:true});window.addEventListener("resize",on_resize);document.getElementById("year_date").textContent=new Date().getFullYear().toString();on_scroll();}DOM.START(main);