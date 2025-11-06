(function(){
	let timer, tab;
	const tabs = [...document.querySelectorAll(".emoji-header-title")],
		blocks = [...document.querySelectorAll(".emoji-main-block")],
		buttons = [...document.querySelectorAll(".emoji-main-block-icon-button")],
		output = document.querySelector('.output'),
		hashes = [],
		restartTimer = () => {
			clearTimeout(timer);
			!output.classList.contains('active') && output.classList.add('active');
			timer = setTimeout(() => {
				clearTimeout(timer);
				output.classList.remove('active');
				timer = setTimeout(() => {
					clearTimeout(timer);
					output.textContent = '';
				}, 300);
			}, 3000);
		},
		listenerTab = (e) => {
			e.preventDefault();
			let target = e.target;
			if(!target.classList.contains('active')) {
				let id = target.getAttribute('data-id');
				let actives = [...document.querySelectorAll('[data-id="' + id + '"]')];
				tabs.forEach((tab) => {
					tab.classList.remove('active');
				});
				blocks.forEach((block) => {
					block.classList.remove('active');
				});
				actives.forEach((el) => {
					el.classList.add('active');
				});
				document.location.hash = id;
			}
			return !1;
		},
		listenerCopy = (e) => {
			e.preventDefault();
			let text = e.target.textContent;
			copyText(text);
			return !1;
		},
		clearSelection = () => {
			if (window.getSelection) {
				window.getSelection().removeAllRanges();
			} else if (document.selection) {
				document.selection.empty();
			}
		},
		copyText = (text) => {
			if(navigator.clipboard){
				navigator.clipboard.writeText(text).then(() => {
					output.textContent = "Скопировано: " + text;
					restartTimer();
				}).catch(()=>{
					output.textContent = "Ошибка: " + text;
					restartTimer();
				});
			}
		},
		historyChange = (e) => {
			if(e){
				e.preventDefault();
			}
			if(document.location.hash == "" || !hashes.includes(document.location.hash)) {
				document.location.hash = "smiles";
			}
			if(tab = document.querySelector('.emoji-header-title[data-id="' + document.location.hash.replace(/#/, '') + '"]')){
				tab.click();
			}
			return !1;
		};
	tabs.forEach((tab) => {
		let id = tab.getAttribute('data-id');
		hashes.push(`#${id}`);
		tab.addEventListener('click', listenerTab);
	});
	buttons.forEach((button) => {
		button.addEventListener('click', listenerCopy);
	});
	window.addEventListener('hashchange', historyChange);
	historyChange();
}());
