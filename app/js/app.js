// // Import vendor jQuery plugin example
// import '~/app/libs/mmenu/dist/mmenu.js'

document.addEventListener('DOMContentLoaded', () => {

	// Custom JS
	mobMenuToggle()
	stickyHeader()
	Timer.init();
	smoothScroll();
	scrollNavbar()
})


// мобильное меню
function mobMenuToggle() {
	let btn = document.querySelector('.header__navigation-btn-menu')
	let menu = document.querySelector(btn.dataset.toggle)
	let header = document.querySelector('.header')
	btn.addEventListener('click', function (e) {
		btn.classList.toggle('active')
		menu.classList.toggle('active')
		header.classList.toggle('active')
	})
	menu.addEventListener('click', function (e) {
		if (e.target.tagName === 'A') {
			btn.classList.remove('active')
			menu.classList.remove('active')
			header.classList.remove('active')
		}
	})
}

function stickyHeader() {
	let header = document.querySelector('.header')

	if (document.body.getBoundingClientRect().top < 0) {
		header.classList.add('sticky')
	} else {
		header.classList.remove('sticky')
	}

	document.addEventListener('scroll', function () {
		if (document.body.getBoundingClientRect().top < 0) {
			header.classList.add('sticky')
		} else {
			header.classList.remove('sticky')
		}

	})
}


let Timer = function () {
	let daysTo = document.querySelectorAll(".days");
	let hoursTo = document.querySelectorAll(".hours");
	let minutesTo = document.querySelectorAll(".minutes");
	let secondsTo = document.querySelectorAll(".seconds");
	return {
		timerMeetup: function timerMeetup() {
			function timer() {
				let today = new Date();
				let countDownDate = new Date(2023, 3, 23, 16, 10);
				let distance = countDownDate - today;
				let days = Math.floor(distance / (1000 * 60 * 60 * 24));
				let hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
				let minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
				let seconds = Math.floor(distance % (1000 * 60) / 1000);
				minutes = minutes < 10 ? "0" + minutes : "" + minutes;
				seconds = seconds < 10 ? "0" + seconds : "" + seconds;
				hours = hours < 10 ? "0" + hours : "" + hours;
				days = days < 10 ? "0" + days : "" + days;
				days = ("" + days).split("");
				hours = ("" + hours).split("");
				minutes = ("" + minutes).split("");
				seconds = ("" + seconds).split("");

				Timer.timeToHtml(daysTo, days);
				Timer.timeToHtml(hoursTo, hours);
				Timer.timeToHtml(minutesTo, minutes);
				Timer.timeToHtml(secondsTo, seconds);
			}

			setInterval(timer, 1000);
		},
		timeToHtml: function timeToHtml(container, time) {
			for (let i = 0; i < container.length; i++) {
				let element = container[i];

				// element.innerHTML = time[i % 2];
				element.innerHTML = time.join('');
			}
		},
		init: function () {
			Timer.timerMeetup();
		}
	};
}();



function smoothScroll() {
	let linkNav = document.querySelectorAll('[href^="#"]')
	let headerHeight = document.querySelector('.header').getBoundingClientRect().height
	let V = 0.2;
	for (let i = 0; i < linkNav.length; i++) {
		linkNav[i].addEventListener('click', function (e) { //по клику на ссылку
			e.preventDefault(); //отменяем стандартное поведение
			let w = window.pageYOffset // производим прокрутка прокрутка
			let hash = this.href.replace(/[^#]*(.*)/, '$1');
			let tar = document.querySelector(hash) // к id элемента, к которому нужно перейти
			let t = tar.getBoundingClientRect().top - headerHeight
			let start = null;

			requestAnimationFrame(step); // подробнее про функцию анимации [developer.mozilla.org]
			function step(time) {
				if (start === null) {
					start = time;
				}
				var progress = time - start,
					r = (t < 0 ? Math.max(w - progress / V, w + t) : Math.min(w + progress / V, w + t));
				window.scrollTo(0, r);
				if (r != w + t) {
					requestAnimationFrame(step)
				} else {
					location.hash = hash // URL с хэшем
				}
			}
			if (t > 1 || t < -1) {
				requestAnimationFrame(step)
			}
		});
	}
}

function scrollNavbar() {
	// Получаем все элементы блоков и элементы навигации

	const navItems = document.querySelectorAll('.navbar__item'); // Замените '.nav-item' на ваш класс элементов навигации
	const blocks = getBlocks(); // Замените '.block' на ваш класс блоков
	const blocksPosition = getBlocksPositions()
	let currentPosition = [blocksPosition[0], blocksPosition[1]]

	function getBlocksPositions() {
		let positions = []
		blocks.forEach((item, index) => {
			positions.push(item.offsetTop)
		})
		return positions
	}


	function getBlocks() {
		let blocks = []
		navItems.forEach((item, index) => {
			blocks.push(document.querySelector(item.getAttribute('href')))
		})
		return blocks
	}

	// Функция, которая определяет, находится ли элемент в зоне видимости экрана
	function isElementInViewport(el, ind, pos) {
		return (
			pos >= el &&
			pos < (blocksPosition[ind + 1] || document.documentElement.getBoundingClientRect().height)
		);
	}

	// Функция, которая добавляет класс активного элемента навигации
	function setActiveNavItem() {
		let documentPosition = Math.abs(document.documentElement.getBoundingClientRect().top) + document.querySelector('.header').getBoundingClientRect().height + 1
		if ((documentPosition > currentPosition[0] && documentPosition < currentPosition[1])) return
		blocksPosition.forEach((block, index) => {
			if (isElementInViewport(block, index, documentPosition)) {
				currentPosition[0] = block
				currentPosition[1] = blocksPosition[index + 1]
				navItems.forEach(navItem => {
					navItem.classList.remove('active'); // Удаляем класс активного элемента навигации у всех элементов
				});
				navItems[index].classList.add('active'); // Добавляем класс активного элемента навигации соответствующему блоку
			}
		});
	}

	// Событие скрола
	window.addEventListener('scroll', setActiveNavItem);
	setActiveNavItem()
}