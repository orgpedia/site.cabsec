function getJSON(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "json";
        xhr.onload = function() {
            var status = xhr.status;
            if (status == 200) {
                resolve(xhr.response);
            } else {
                reject(status);
            }
        };
        xhr.send();
    });
}

function initSearchIndex() {
    getJSON("http://0.0.0.0:8500/lunr.idx.json").then(function(data) {
        searchIndex = lunr.Index.load(data);
    }, function(status) {
        console.log("Unable to load the search index.");
    });

    getJSON("http://0.0.0.0:8500/docs.json").then(function(data) {
        pagesIndex = data;
    }, function(status) { //error detection....
        console.log("Unable to load docs.");
    });
}

function getLunrSearchQuery(query) {
    const searchTerms = query.split(" ");
    if (searchTerms.length === 1) {
        return query;
    }
    query = "";
    for (const term of searchTerms) {
        query += `+${term} `;
    }
    return query.trim();
}

function getSearchResults(query) {
    return searchIndex.search(query).flatMap((hit) => {
        if (hit.ref == "undefined") return [];
        let pageMatch = pagesIndex.filter((page) => page.idx === parseInt(hit.ref, 10))[0];
        pageMatch.score = hit.score;
        return [pageMatch];
    });
}

function searchSite(query) {
    const originalQuery = query;
    query = getLunrSearchQuery(query);
    let results = getSearchResults(query);
    return results.length
        ? results
        : query !== originalQuery
        ? getSearchResults(originalQuery)
        : [];
}

function handleSearchQuery(event) {
    console.log("INSIDE DESKTOP SEARCH.");
    event.preventDefault();
    const query = document.getElementById("search").value.trim().toLowerCase();
    if (!query) {
        console.log("Please enter a search term");
        return;
    }
    const results = searchSite(query);
    if (!results.length) {
        displayErrorMessage("No results found");
        return;
    }
    renderSearchResults(query, results);
}

function renderSearchResults(query, results) {
    clearSearchResults();
    updateSearchResults(query, results);
    showSearchResults();
    //scrollToTop();
}

function clearSearchResults() {
    const results = document.getElementById("search-cells");
    while (results.firstChild) results.removeChild(results.firstChild);
}


function updateSearchResults(query, results) {
    document.getElementById("query").innerHTML = "Search Terms: \"" + query + "\" " + `(${results.length} results)`;
    document.getElementById("search-cells").innerHTML = results
        .map(
            (hit) => `
      <div onclick="location.href='${hit.url}';" style="cursor: pointer;"
        class="bg-white p-5 flex flex-col justify-center items-center rounded-sm shadow-md">
        <img src="${hit.image_url}" class="w-[75px] h-[106px]" alt="${hit.full_name}">
        <div class="text-center mt-3.5">
            <h4 class="text-base">${hit.full_name}</h4>
            <p class="text-[11px] text-[#999999]">Tenure: ${hit.tenure_str}</p>
       </div>
    </div>
    `
        )
        .join("");
}

function createSearchResultBlurb(query, hit) {
    return `
      <table>
        <tr>
          <td>
            <figure>
              <div class="searchBox">
                <img src="${hit.image_url}">
              </div>
            </figure>
          </td>
          <td>
            <h4 style="font-family: Tahoma, Geneva, sans-serif;">Key Tenures</h4>
            <ul>
              <li><p><b>${hit.key_dept1}</b>&nbsp; ${hit.tenure_str}
            </ul>
          </td>
        </tr>
      </table>
      <hr>
      `;
}

function showSearchResults() {
    document.querySelectorAll(".primary").forEach(
        (ar) => (ar.classList.add("hide-element"))
    );
    document.querySelector(".search-results").classList.remove("hide-element");
}

function hideSearchResults() {
    document.querySelector(".search-results").classList.add("hide-element");

    document.querySelectorAll(".primary").forEach(
        (ar) => (ar.classList.remove("hide-element"))
    );
}

function handleClearSearchButtonClicked() {
    console.log("INSIDE MOBILE SEARCH.");
    hideSearchResults();
    clearSearchResults();
    document.getElementById("search").value = "";
}

function displayErrorMessage(message) {
    document.querySelector(".search-error-message").innerHTML = message;
    document.querySelector(".search-container").classList.remove("focused");
    document.querySelector(".search-error").classList.remove("hide-element");
    document.querySelector(".search-error").classList.add("fade");
}

function removeAnimation() {
    this.classList.remove("fade");
    this.classList.add("hide-element");
    document.querySelector(".search-container").classList.add("focused");
}

function searchBoxFocused() {
    document.querySelector(".search-container").classList.add("focused");
    document
        .getElementById("search")
        .addEventListener("focusout", () => searchBoxFocusOut());
}

function searchBoxFocusOut() {
    document.querySelector(".search-container").classList.remove("focused");
}

function handleMobileSearch(event)
{
    event.preventDefault();
    console.log("INSIDE MOBILE SEARCH.");

    const query = document.getElementById("mobileSearch").value.trim().toLowerCase();
    if (!query) {
        console.log("Please enter a search term");
        return;
    }
    const results = searchSite(query);
    if (!results.length) {
        displayErrorMessage("No results found");
        return;
    }
    renderSearchResults(query, results);
}

initSearchIndex();
document.addEventListener("DOMContentLoaded", function () {
    console.log("DONE INIT." + document.readyState);
    if (document.getElementById("search-form") != null) {
        const searchInput = document.getElementById("search");
        searchInput.addEventListener("focus", () => searchBoxFocused());
        searchInput.addEventListener("keydown", (event) => {
            if (event.keyCode == 13) handleSearchQuery(event);
        });
        document
            .querySelector(".fa-search")
            .addEventListener("click", (event) => handleSearchQuery(event));
    }

    if (document.getElementById("mobileSearch") != null) {
        const mobileSearchInput = document.getElementById("mobileSearch");
        mobileSearchInput.addEventListener("keydown", (event) => {
            if (event.keyCode == 13) handleMobileSearch(event);
        });
    }

    if (document.getElementById("clear-search-results") != null) {
        const button = document.getElementById("clear-search-results");
        button.addEventListener("click", () => handleClearSearchButtonClicked());
    }
    initPage();

});

window.addEventListener("load", function () {
    console.log("DONE LOAD." + document.readyState);
    initSVGPage();
});



const sel_color="bg-white border border-blue-500 lg:border-r-0 relative cursor-pointer text-sm";
// need a way to remove this relative only for mobile, the boxes are not linig correctly
const sel_child_color="p-2 w-full h-full min-w-[210px] relative bg-white focus:bg-white z-20 lg:-right-1 -bottom-4 lg:-bottom-0 text-[#333333]";
const unsel_color="bg-[#D9D9D9] border border-[#B8B8B8] border-r-0 cursor-pointer text-sm text-[#333333]";
const unsel_child_color="p-2 w-full h-full min-w-[210px]";


/*
const sel_color="a-a";
const sel_child_color="a-b";
const unsel_color="a-c";
const unsel_child_color="a-d";
*/

const relevant_orders=`<div onclick="change_location('tenure_{idx}_order_id')" style="cursor: pointer;" class="flex gap-4 items-center">
<span><img src="../images/pdf.svg"> </span>
<p id="tenure_{idx}_order_id" class="text-sm font-bold">{order_id}</p>
<p class="text-sm"> [{detail_idx}] {order_category}</p>
</div>`


function updatePanel(idx) {
    console.log("Inside udpatePane." + idx + " current: " + current_tenure_idx);

    if (idx == current_tenure_idx){
        console.log("Same click;")
        return
    }

    click_div = document.getElementById("tenure-" + idx);
    click_child_div = document.getElementById("tenure-child-" + idx);

    prev_click_div = document.getElementById("tenure-" + current_tenure_idx);
    prev_child_div = document.getElementById("tenure-child-" + current_tenure_idx);

    click_div.className = sel_color;
    click_child_div.className = sel_child_color;

    prev_click_div.className = unsel_color;
    prev_child_div.className = unsel_child_color;

//    console.log("Done updating");

    tenure_info = tenure_info_array[idx];
    document.getElementById("rt-ministry").textContent = tenure_info["ministry"];
    document.getElementById("rt-dept").textContent = tenure_info["dept"];
    document.getElementById("rt-role").textContent = tenure_info["role"];
    document.getElementById("rt-date_str").textContent = tenure_info["date_str"];

    document.getElementById("rt-start_order_id").textContent = tenure_info["start_order_id"];
    document.getElementById("rt-end_order_id").textContent = tenure_info["end_order_id"];

    // console.log("Inside udpatePane. before looping" + idx);

    m_idx = 0;
    for (manager of tenure_info["manager_infos"]){
        document.getElementById("rt-manager-full_name-" + m_idx).textContent = manager["full_name"];
        document.getElementById("rt-manager-url-" + m_idx).textContent = manager["url"];
        document.getElementById("rt-manager-image_url-" + m_idx).src = manager["image_url"];
        document.getElementById("rt-manager-role-" + m_idx).textContent = manager["role"];
        document.getElementById("rt-manager-date_str-" + m_idx).textContent = manager["date_str"];
        m_idx += 1;
    }
    if (tenure_info["manager_infos_count"] < 3){
        document.getElementById("md-div-1").classList.add("hidden");
        document.getElementById("md-center-line").classList.add("hidden");
    }else
    {
        document.getElementById("md-div-1").classList.remove("hidden");
        document.getElementById("md-center-line").classList.remove("hidden");
    }


    //    console.log("Inside udpatePane. after looping" + idx);
    document.getElementById("relevant-orders").innerHTML = tenure_info.all_orderid_detailidxs.map(
        (order_info) => `
         <div onclick="change_location_detail('rel-${order_info[0]}', 'rel-${order_info[2]}')" style="cursor: pointer;" class="flex gap-4 items-center">
             <span><img src="../images/pdf.svg"> </span>
             <span id="rel-${order_info[0]}" class="text-sm font-bold">${order_info[0]}</span>
             <span id="rel-${order_info[2]}" class="text-sm">[${order_info[2]}]</span>
             <span class="text-sm">${order_info[1]}</span>
         </div>
         `).join("");
    current_tenure_idx=idx;
}

function select_language() {

    var lang_menu = document.getElementById("lang_menu");
    const lang = lang_menu.options[ lang_menu.selectedIndex ].value;
    if (lang == "ignore"){
        return;
    }
    //console.log("selected_language " + lang + " " + document.location.pathname);
    const curr_pathname = document.location.pathname;
    const new_pathname = '/' + lang + curr_pathname.substring(curr_pathname.indexOf('/', 1));

//    console.log("selected_language " + lang + " " + new_pathname);    

    document.location.pathname = new_pathname;



    // lang_text = lang_menu.options[ lang_menu.selectedIndex ].text;
    // document.getElementById("language-button").textContent = "";

    // new_url  = lang + "/" + url;
    // window.location.assign(new_url);
};

function change_location(para_id) {
    console.log("Para ID: " + para_id);
    para = document.getElementById(para_id);
    order_id = para.textContent;
    console.log("Order ID: " + para_id);
    location.href = "order-" + order_id + ".html";
}

function change_location_detail(para_id, detail_id) {
    console.log("Para ID: " + para_id + " detail_id: " + detail_id);
    para = document.getElementById(para_id);
    order_id = para.textContent;
    console.log("Order ID: " + para_id);

    detail_idx = para.nextElementSibling.textContent;
    detail_idx = Number(detail_idx.substring(1, detail_idx.length-1))
    detail_num = String(detail_idx + 1);

    location.href = "order-" + order_id + ".html?detail_num=" + detail_num;
}


function change_location_officer(div_id) {
    div = document.getElementById(div_id);
    location.href = div.textContent;
}



function expandMinistry(idx, t_idx=-1) {
    console.log("\tExpand Ministry: " + idx + " cur: " + current_ministry_idx + "  t_idx: " + t_idx);
    if (idx == current_ministry_idx){
        if (t_idx == -1)
        {
            console.log("Same Ministry and no Tenure");
            return;
        }
        else
        {
            console.log("\UpdatePanel top: t_idx: " + t_idx);
            updatePanel(t_idx);
            return;
        }
    }

    earlierDiv = document.getElementById("m" + current_ministry_idx);
    earlierDiv.classList.toggle("cursor-pointer");

    earlierButton = document.getElementById("sm" + current_ministry_idx);
    earlierButton.removeAttribute("transform");

    earlierDiv.nextElementSibling.classList.toggle("hidden");

    current_ministry_idx = idx;
    ministryDiv = document.getElementById("m" + idx);
    ministryDiv.classList.toggle("cursor-pointer");

    buttonDiv = document.getElementById("sm" + idx);
    buttonDiv.setAttribute("transform", "rotate(180)");
    tenuresDiv = ministryDiv.nextElementSibling;
    tenuresDiv.classList.toggle("hidden");

    if (t_idx == -1){
        first_tenure_idx = tenuresDiv.children[0].id.split("-")[1];
        updatePanel(first_tenure_idx);
    }else{
        console.log("\UpdatePane: t_idx: " + t_idx);
        updatePanel(t_idx);
    }
}


function initPage()
{
    console.log("Inside initPage");
    if (! document.location.href.includes("?")){
        if (document.location.href.includes("order-")) {
            console.log("Inside init_order_buttons");
         init_order_buttons();
        } else if (document.location.href.includes("details-")) {
            console.log("Inside init_details_buttons");
            init_details_buttons();
        }
        return;
    }

    if (document.location.href.includes("officer-")) {
        const myURLObj = new URL(document.location.href);
        const tenure_idx = myURLObj.searchParams.get("tenure_idx");
        if (tenure_idx) {
            console.log("Inside initPage->officerPage: " + tenure_idx);
            initOfficerPage(tenure_idx);
        }
    } else if (document.location.href.includes("order-")) {
        const myURLObj = new URL(document.location.href);
        const detail_num = myURLObj.searchParams.get("detail_num");
        if (detail_num){
            initOrderPage(detail_num);
        }else{
            init_order_buttons();
        }


    } else if (document.location.href.includes("details-")) {
        const myURLObj = new URL(document.location.href);
        const detail_num = myURLObj.searchParams.get("detail_num");
        if (detail_num){
            initDetailsPage(detail_num);
        }
    }
}

function initSVGPage()
{
    console.log("Inside initPage");
    if (! document.location.href.includes("?"))
        return;

    if (document.location.href.includes("details-")) {
        const myURLObj = new URL(document.location.href);
        const detail_num = myURLObj.searchParams.get("detail_num");
        current_detail_num = 1;
        num_details = detail_info_array.length;
        if ( (detail_num) && (detail_num <= num_details) && (detail_num >= 1) && (detail_num != current_detail_num)){
            console.log("REMOVING");
            paint_pipe(current_detail_num-1, false);
            paint_pipe(detail_num-1, true);
        }
    }
}



function initOfficerPage(tenure_idx)
{
    console.log("init TenurePage: tenure_idx: " + tenure_idx + " len: " + tenure_info_array.length);
    idx = 0;
    m_idx = -1;
    for (tenure of tenure_info_array){
        if(tenure["tenure_idx"] == tenure_idx){
            m_idx = tenure["ministry_idx"];
            console.log("\tinit TenurePage: setting m_idx: " + m_idx + " idx: " + idx);
            break;
        }
        idx += 1;
    }
    console.log("init TenurePage: m_idx:" + m_idx + " idx: " + idx);
    if (m_idx != -1){
        expandMinistry(m_idx, idx);
    }
}

function initOrderPage(detail_num)
{
    if (detail_num && (detail_num > 0)){
        const num_pages = Number(document.getElementById("num_pgs"));
        const page_idx = Number(detail_page_idxs[detail_num -1]);

        // Change the image
        load_image(page_idx);
        manage_buttons(page_idx + 1, num_pages);

        // Scroll detail
        scroll_to(detail_num -1);
    }
}

function scroll_to(detail_idx)
{
    console.log("Scroll to: " + detail_idx);
    parent_div = document.getElementById("details_scroll");
    const details_div = document.getElementById("d"+detail_idx);
    if (parent_div && details_div) {
        const top = details_div.offsetTop - document.getElementById("d0").offsetTop;
        parent_div.scrollTop = top + 10;
    }
}


function change_image(inc)
{
    const current_page_num = Number(document.getElementById("pg_num").textContent);
    const num_pages = Number(document.getElementById("num_pgs").textContent);

    if ((current_page_num == 1) && (inc <= 0) ){
        return;
    }

    if ((current_page_num == num_pages) && (inc >= 0)){
        return;
    }

    new_page_num = (current_page_num + inc);
    new_page_idx = new_page_num - 1;

    load_image(new_page_idx);

    manage_buttons(new_page_num, num_pages);

    top_detail_idx = detail_page_idxs.indexOf(new_page_idx);
    scroll_to(top_detail_idx);
}

function load_detail(detail_idx)
{
    console.log("\nInside load_detail");
    const detail_info = detail_info_array[detail_idx];
    for (idx in detail_info){
        if (idx == detail_info.length -1){
            continue;
        }
        const element = document.getElementById("d" + idx);
        if (element == null) {
            continue
        }

        if (idx != 1)
            element.innerHTML = detail_info[idx];
        else
            element.src = detail_info[idx];
    }

    const page_idx = Number(detail_info[detail_info.length -1]);
    console.log("\nInside load_detail LOADING PAGE + " + page_idx );
    load_image(page_idx);

    detail_ppln_list = detail_ppln_info_array[detail_idx]
    for (pipe_idx in detail_ppln_list){
        pipe_info = detail_ppln_list[pipe_idx];
        for (info_idx in pipe_info){
            element = document.getElementById(pipe_idx + "-" + info_idx);
            if (!element) {
                console.log("Element not found " + pipe_idx + "-" + info_idx);
                continue;
            }
            element.textContent = pipe_info[info_idx];
        }
    }
    const current_detail_elem = document.getElementById("d_num");
    current_detail_elem.textContent = detail_idx + 1;

    const crumb_detail_elem = document.getElementById("d_num2");
    crumb_detail_elem.textContent = "Detail-" + (detail_idx + 1);
}

function load_image(page_idx)
{
    const image_element = document.getElementById("pg_img");
    if ( image_element == null){
        console.log("Image not found");
        return;
    }

    const page_num_element = document.getElementById("pg_num");
    const current_page_num = Number(page_num_element.textContent);

    console.log("PageNum: " + current_page_num + " page_idx: " + page_idx);
    if (current_page_num == (page_idx + 1)){
        console.log("Same Page Number");
        return;
    }

    if (image_element.nodeName == "OBJECT"){
        var url = image_element.data;
    }else{
        var url = image_element.src;
    }

    console.log("url: " + url);
    const u_len = url.length;
    const new_num = String(page_idx + 1).padStart(3, "0");
    const new_url = url.substring(0, u_len-7) + new_num + url.substring(u_len-4, u_len);

    if (image_element.nodeName == "OBJECT"){
        image_element.data = new_url;
    } else {
        image_element.src = new_url;
    }

    console.log("url: " + url + " new_url: " + new_url);
    page_num_element.textContent = page_idx + 1;
}

function init_order_buttons()
{
    const page_num = Number(document.getElementById("pg_num").textContent);
    const num_pages = Number(document.getElementById("num_pgs").textContent);
    manage_buttons(page_num, num_pages);
}

function init_details_buttons()
{
    const current_detail_num = Number(document.getElementById("d_num").textContent);
    const num_details = detail_info_array.length;
    manage_buttons(current_detail_num, num_details);
}


function manage_buttons(current_num, num_items)
{
    console.log("Inside manage buttons " + current_num + " " + num_items);
    prev_button = document.getElementById("prev");
    next_button = document.getElementById("next");

    if( (prev_button == null) || (next_button == null) ){
        return;
    }

    if (current_num == 1){
        console.log("Inside current_num == 1");
        prev_button.disabled = true;
        next_button.disabled = false;
        prev_button.classList.remove("cursor-pointer");
        next_button.classList.add("cursor-pointer");
    } else if (current_num == num_items) {
        console.log("Inside current_num == num_items");
        prev_button.disabled = false;
        next_button.disabled = true;
        prev_button.classList.add("cursor-pointer");
        next_button.classList.remove("cursor-pointer");
    } else {
        console.log("Inside both");
        prev_button.disabled = false;
        next_button.disabled = false;
        next_button.classList.add("cursor-pointer");
        prev_button.classList.add("cursor-pointer");
    }
}


function change_detail(inc)
{
    console.log("\nInside change_detail");

    if ( (inc != -1) && (inc != 1)){
        console.log("\t>returning");
        return;
    }

    const current_detail_elem = document.getElementById("d_num");
    const current_detail_num = Number(current_detail_elem.textContent);
    console.log("\t>d_num: " + current_detail_num);

    if( (current_detail_num == 1) && (inc < 0) )
        return;

    const num_details = detail_info_array.length;
    if( (current_detail_num == num_details) && (inc > 0) )
        return;

    console.log("\t>d_num: " + current_detail_num + " num_details: " + num_details);

    load_detail(current_detail_num + inc - 1);
    manage_buttons(current_detail_num + inc, num_details);
    paint_pipe(current_detail_num-1, false);
    paint_pipe(current_detail_num + inc -1, true);

}


function initDetailsPage(detail_num)
{
    const current_detail_num = document.getElementById("d_num").textContent;
    const num_details = detail_info_array.length;

    if ( (detail_num <= num_details) && (detail_num >= 1) && (detail_num != current_detail_num))
    {
	const detail_idx = detail_num -1;
	load_detail(detail_idx);
	manage_buttons(detail_num, num_details);
    }
}

function paint_pipe(detail_idx, add_class)
{
    if ((detail_idx < 0) || (detail_idx >= detail_info_array.lenght)){
	return;
    }
    console.log("paint_pipe detail_idx: " + detail_idx + " add_class: " + add_class);

    var svg_doc = document.getElementById("pg_img").contentDocument;
    const svg_info = detail_ppln_info_array[detail_idx][3][3][0]["idxs"]; // first 3 is to get pipe, second 3 is for svg_info

    if (svg_doc == null){
	console.log(" FAIL _SVG DOC" + document.readyState);
	return;
    }



    console.log("paint_pipe detail_idx: " + svg_info);


    for (var class_name in  svg_info) {
	idxs_list = svg_info[class_name];
	console.log("paint_pipe class_name: " + class_name + " idxlist: " + idxs_list);
	if (idxs_list[0] instanceof Array){
	    for (idxs of idxs_list){
		var i = 0;
		for (idx of idxs){
		    if (add_class) {
			console.log(" ADDING INDEX" + class_name + i);
			svg_doc.getElementById(String(idx)).classList.add(class_name + String(i));
		    } else {
			svg_doc.getElementById(String(idx)).classList.remove(class_name + String(i));
		    }
		    i = i + 1;
		}
	    }
	} else {
	    for (idx of idxs_list){
		if (add_class) {
		    console.log(" ADDING" + idx);
		    svg_doc.getElementById(String(idx)).classList.add(class_name);
		} else {
		    svg_doc.getElementById(String(idx)).classList.remove(class_name);
		}
	    }
	}

    }
}


function load_svg(pipe_idx)
{
    console.log(" LOAD SVG: " + pipe_idx);
    const current_detail_num = Number(document.getElementById("d_num").textContent);
    const current_pipe_idx = Number(document.getElementById("p_idx").textContent);

//    paint_pipe(current_pipe_idx, add_class=false);
    paint_pipe(pipe_idx, add_class=true);
}


function readMore(button) {
    console.log("inside readMore");
    detailElement = button.parentNode;
    expand_text = detailElement.querySelector(".expand_text");
    expand_text.classList.toggle("hidden");
    svg_elem = button.firstElementChild;

    console.log('svg_elem: ' + svg_elem);

    if (svg_elem.hasAttribute("transform")) {
	svg_elem.removeAttribute("transform");
    }else {
	svg_elem.setAttribute("transform", "rotate(180)");
    }
}

function readMore2(button) {
    console.log("inside readMore");
    detailElement = button.parentNode;
    expand_text = detailElement.querySelector(".expand_text");
    expand_text.classList.toggle("hidden");
    img_elem = button.firstElementChild;
    console.log('img_elem: ' + img_elem);
    img_elem.classList.toggle("rotate-180");
}




// function initOrderPage(){
//     const myURLObj = new URL(document.location.href);
//     const page_num = myURLObj.searchParams.get('page_num');
//     const detail_num = myURLObj.searchParams.get('detail_num');
//     const carousel = carousel_elem.carousel;
//     position = carousel._getActiveItem().position;

//     console.log("InitPage: " + page_num + " Position: " + position + " lenght" + carousel._items.length);

//     if (page_num && ((page_num - 1) != position) && (page_num > 0)){
// 	console.log("INSIDE: " + page_num + " Position: " + position);
// 	position = carousel._getActiveItem().position;
// 	page_idx = page_num - 1;
// 	// if (page_idx > position) {
// 	//     for(idx = position; idx <= page_idx; idx++){
// 	// 	carousel.next();
// 	//     }
// 	// }else {
// 	//     for(idx = position; idx >= page_idx; idx--){
// 	// 	carousel.prev();
// 	//     }
// 	// }
// 	carousel.slideTo(page_num-1);
// 	console.log("INSIDE: " + page_num + " Position: " + position);
//     }

//     if (detail_num) {
// 	console.log("Detail Inside: " + detail_num);
// 	parent_div = document.getElementById("details_scroll");
// 	const details_div = document.getElementById("d"+detail_num);
// 	console.log(details_div.textContent);
// 	if (details_div) {
// 	    const top = details_div.offsetTop - document.getElementById("d0").offsetTop;
// 	    console.log("Scrolling: " + top);
// 	    parent_div.scrollTop = top;
// 	}
//     }
//     //carousel_elem.classList.toggle('hidden');
// }
