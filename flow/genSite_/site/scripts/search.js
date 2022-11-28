function getJSON(url) {
    return new Promise(function(resolve, reject) {
	var xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.responseType = 'json';
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
};

function initSearchIndex() {
    getJSON('http://0.0.0.0:8500/lunr.idx.json').then(function(data) {
	searchIndex = lunr.Index.load(data);
    }, function(status) { 
	console.log('Unable to load the search index.');
    });
    
    getJSON('http://0.0.0.0:8500/docs.json').then(function(data) {
	pagesIndex = data
    }, function(status) { //error detection....
	console.log('Unable to load docs.');
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
    console.log('INSIDE DESKTOP SEARCH.');	    
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
    console.log('INSIDE MOBILE SEARCH.');	
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
    console.log('INSIDE MOBILE SEARCH.');	
    
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
    console.log('DONE INIT.');
    initPage();
    
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
<span><img src="images/pdf.svg"> </span>
<p id="tenure_{idx}_order_id" class="text-sm font-bold">{order_id}</p>
<p class="text-sm"> [{detail_idx}] {order_category}</p>
</div>`


function updatePanel(idx) {
    console.log('Inside udpatePane.' + idx + " current: " + current_tenure_idx);

    if (idx == current_tenure_idx){
	console.log('Same click;')
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

//    console.log('Done updating');
    
    tenure_info = tenure_info_array[idx];
    document.getElementById("rt-ministry").textContent = tenure_info["ministry"];
    document.getElementById("rt-dept").textContent = tenure_info["dept"];
    document.getElementById("rt-role").textContent = tenure_info["role"];    
    document.getElementById("rt-date_str").textContent = tenure_info["date_str"];
    
    document.getElementById("rt-start_order_id").textContent = tenure_info["start_order_id"];
    document.getElementById("rt-end_order_id").textContent = tenure_info["end_order_id"];

    // console.log('Inside udpatePane. before looping' + idx);        

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


    //    console.log('Inside udpatePane. after looping' + idx);
    document.getElementById("relevant-orders").innerHTML = tenure_info.all_orderid_detailidxs.map(
	(order_info) => `
         <div onclick="change_location('rel-${order_info[0]}')" style="cursor: pointer;" class="flex gap-4 items-center">
             <span><img src="images/pdf.svg"> </span>
             <span id="rel-${order_info[0]}" class="text-sm font-bold">${order_info[0]}</span>
             <span class="text-sm">[${order_info[2]}] Order Type:</span> 
             <span class="text-sm font-bold">${order_info[1]}</span>
         </div>
         `).join("");
    current_tenure_idx=idx;
}

function select_language() {
//    console.log("select_language");	      
    var lang_menu = document.getElementById("lang_menu");
    lang = lang_menu.options[ lang_menu.selectedIndex ].value;
    if (lang == "ignore"){
	return;
    }
    
    lang_text = lang_menu.options[ lang_menu.selectedIndex ].text;
    document.getElementById("language-button").textContent = "";
    
    new_url  = lang + '/' + url;
    window.location.assign(new_url);
};

function change_location(para_id) {
    console.log("Para ID: " + para_id);
    para = document.getElementById(para_id);
    order_id = para.textContent;
    console.log("Order ID: " + para_id);    
    location.href = 'order-' + order_id + '.html';
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
	    console.log('Same Ministry and no Tenure');
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
    earlierDiv.classList.toggle('cursor-pointer');
    
    earlierButton = document.getElementById("sm" + current_ministry_idx);
    earlierButton.removeAttribute("transform");
    
    earlierDiv.nextElementSibling.classList.toggle('hidden');
    
    current_ministry_idx = idx;
    ministryDiv = document.getElementById("m" + idx);
    ministryDiv.classList.toggle("cursor-pointer");
    
    buttonDiv = document.getElementById("sm" + idx);
    buttonDiv.setAttribute("transform", "rotate(180)");
    tenuresDiv = ministryDiv.nextElementSibling;
    tenuresDiv.classList.toggle('hidden');
    
    if (t_idx == -1){
	first_tenure_idx = tenuresDiv.children[0].id.split("-")[1];
	updatePanel(first_tenure_idx);
    }else{
	console.log("\UpdatePane: t_idx: " + t_idx);
	updatePanel(t_idx);
    }
}


function initPage() {
    console.log("Inside initPage");
    if (! document.location.href.includes('?'))
	return;

    
    if (document.location.href.includes('officer-')) {
	const myURLObj = new URL(document.location.href);
	const tenure_idx = myURLObj.searchParams.get('tenure_idx');
	if (tenure_idx) {
	    console.log("Inside initPage->officerPage: " + tenure_idx);	    
	    initOfficerPage(tenure_idx);
	}
    } else if (document.location.href.includes('order-')) {
	const myURLObj = new URL(document.location.href);	
	const detail_num = myURLObj.searchParams.get('detail_num');
	if (detail_num){
	    initOrderPage(detail_num);
	}
    } else if (document.location.href.includes('details-')) {
	const myURLObj = new URL(document.location.href);	
	const detail_num = myURLObj.searchParams.get('detail_num');
	if (detail_num){
	    initDetailsPage(detail_num);
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
	if (! element) {
	    console.log("Element not found " + idx);
	    continue
	}
	
	if (idx != 1)
	    element.innerHTML = detail_info[idx];
	else
	    element.src = detail_info[idx];
    }

    const page_idx = Number(detail_info[detail_info.length -1]);
    load_image(page_idx);

    detail_ppln_list = detail_ppln_info_array[detail_idx]
    for (pipe_idx in detail_ppln_list){
	pipe_info = detail_ppln_list[pipe_idx];
	for (info_idx in pipe_info){
	    element = document.getElementById(pipe_idx + "-" + info_idx);
	    if (!element) {
		console.log("Element not found " + pipe_idx + "-" + info_idx);
	    }
	    element.textContent = pipe_info[info_idx];
	}
    }
    const current_detail_elem = document.getElementById("d_num");
    current_detail_elem.textContent = detail_idx + 1;

    const crumb_detail_elem = document.getElementById("d_num2");
    crumb_detail_elem.textContent = 'Detail-' + (detail_idx + 1);    
}

function load_image(page_idx)
{
    const image_element = document.getElementById("pg_img");
    if ( ! image_element){
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

    const url = image_element.src;
    const u_len = url.length;
    const new_num = String(page_idx + 1).padStart(3, '0');
    const new_url = url.substring(0, u_len-7) + new_num + url.substring(u_len-4, u_len);
    image_element.src = new_url;
    console.log("url: " + url + " new_url: " + new_url);
    page_num_element.textContent = page_idx + 1;
}

function manage_buttons(current_num, num_items)
{
    prev_button = document.getElementById("prev");
    next_button = document.getElementById("next");
    
    if (current_num == 1){
	prev_button.disabled = true;
	next_button.disabled = false;
	prev_button.classList.remove("cursor-pointer");
	next_button.classList.add("cursor-pointer");	
    } else if (current_num == num_items) {
	prev_button.disabled = false;
	next_button.disabled = true;
	prev_button.classList.add("cursor-pointer");
	next_button.classList.remove("cursor-pointer");	
    } else {
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
}


function initDetailsPage(detail_num)
{
    current_detail_num = document.getElementById("d_num");
    num_details = detail_info_array.length;

    if ( (detail_num <= num_details) && (detail_num >= 1) && (detail_num != current_detail_num))
    {
	detail_idx = detail_num -1;
	load_detail(detail_idx);
	manage_buttons(detail_num, num_details);	
    }
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
