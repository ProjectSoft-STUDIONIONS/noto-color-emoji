(function(){
	let timer;
	const tabs = [...document.querySelectorAll(".emoji-header-title")],
		blocks = [...document.querySelectorAll(".emoji-main-block")],
		buttons = [...document.querySelectorAll(".emoji-main-block-icon-button")],
		output = document.querySelector('.output'),
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
		};

	tabs.forEach((tab) => {
		tab.addEventListener('click', listenerTab);
	});
	buttons.forEach((button) => {
		button.addEventListener('click', listenerCopy);
	})
}());
