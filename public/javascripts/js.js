
var KEYCODE_ENTER = 13;
var KEYCODE_ESC = 27;
var KEYCODE_DOWN = 40;
var KEYCODE_UP = 38;


var AutoComplete = {

  $inputEl: null,
	$resultEl: null,
	$assertEl: null,
	searchData: [],
	currentSearch: null,
	$currentSelectedEl: null,
	currentSelectedIndex: 0,
	currentNoOfResults: null,
	selectedClass: 'svti-autocomplete__selected',

	init: function(){

    console.log('init');

		this.$inputEl = $('#svti-autocomplete__input');
    console.log("x",this.$inputEl,this.$inputEl.length);
		this.$resultEl = $('.svti-autocomplete__result');

		this.getSearchData();
		this.bindListeners();

		//Insert div for screenreader messages
		this.$assertEl = $('<div class="a11y__hide-visibly" aria-live="assertive"></div>');
		this.$inputEl.after(this.$assertEl);

		//Set initial aria attributes for input
		this.$inputEl.attr('aria-haspopup', 'true').attr('aria-controls', 'svti-autocomplete__result');
	},

	bindListeners: function(){


		var self = this;

    console.log("bind",this.$inputEl,this.$inputEl.length);

		this.$inputEl.on('keyup', function(event){

      console.log("keyup");

			//enter
			if(event.keyCode === KEYCODE_ENTER){
				var $gotoEl = self.$resultEl.find('.'+ self.selectedClass);

				$gotoEl.addClass(self.selectedClass + "--active");

				if($gotoEl.length > 0){
					location.href = $gotoEl.attr('href');
					return false;
				}
			} else if(event.keyCode === KEYCODE_ESC){
				self.clearResult();
			} else if(event.keyCode === KEYCODE_DOWN){
				self.currentSelectedIndex++;

				if(self.currentSelectedIndex > self.currentNoOfResults) {
					self.currentSelectedIndex = 1;
				}

				self.handleSelected();
			} else if(event.keyCode === KEYCODE_UP){
				self.currentSelectedIndex--;

				if(self.currentSelectedIndex <= 0) {
					self.currentSelectedIndex = self.currentNoOfResults;
				}

				self.handleSelected();
			} else if(self.currentSearch != self.$inputEl.val()) {
				self.search();
			}
		});

		this.$inputEl.on('focusin', function(){
			self.search();
		});

		this.$inputEl.on('focusout', function(event){
			setTimeout(function() {
				var $focusedEl = $(document.activeElement);
				self.checkClear($focusedEl);
			}, 100);
		});

		//iOS doesn't trigger focusout
		$(document).on('touchend', function(event) {
			var $focusedEl = $(event.target);
			self.checkClear($focusedEl);
		});
	},

	search: function(){

    console.log( ' searching ')

		this.currentSearch = this.$inputEl.val();

		if(this.currentSearch.length > 0){
			this.currentNoOfResults = 0;
			var markup = '<ul class="svti-autocomplete__result-list">';

			for(var i=0; i < this.searchData.length && this.currentNoOfResults < 5; i++){
				if(this.searchData[i].title && this.searchData[i].url && this.searchData[i].title.toLowerCase().indexOf(this.currentSearch.toLowerCase()) != -1){
					markup += '<li class="svti-autocomplete__result-item"><a class="svti-autocomplete__result-link" href="'+ this.searchData[i].url +'">'+ this.searchData[i].title +'</a></li>';
					this.currentNoOfResults++;
				}
			}

			if(true) {
				markup += '<li class="svti-autocomplete__result-item svti-autocomplete__result-item-all"><a class="svti-autocomplete__result-link svti-autocomplete__result-link-all" href="http://www.svt.se/search/?q=' + this.currentSearch + '">Sök <b>'+ this.currentSearch +'</b> på hela svt </a></li>';
				this.currentNoOfResults++;
			}

			markup += '</ul>';

			if(this.currentNoOfResults > 0) {
				this.showResult(markup);
			} else {
				this.clearResult();
			}
		} else {
			this.clearResult();
		}
	},

	showResult: function(markup){
		this.currentSelectedIndex = 0;
		this.$currentSelectedEl = null;
		this.$resultEl.html(markup);

		this.assertScreenReader(this.currentNoOfResults-1 +' sökförslag visas');
	},

	checkClear: function($focusedEl){
		if(!$.contains(this.$resultEl[0], $focusedEl[0])) {
			this.clearResult();
		}
	},

	clearResult: function(){
		this.currentSelectedIndex = 0;
		this.$currentSelectedEl = null;
		this.$resultEl.html('');
		this.assertScreenReader('');
	},

	handleSelected: function(){
		if(this.$currentSelectedEl){
			this.$currentSelectedEl.removeClass(this.selectedClass);
		}

		this.$currentSelectedEl = this.$resultEl.find('li:eq('+ (this.currentSelectedIndex-1) +') > a');

		this.$currentSelectedEl.addClass(this.selectedClass);

		//Notify screenreader
		this.assertScreenReader(this.$currentSelectedEl.text());

		//Change input with selection from autocomplete
		if(this.currentSelectedIndex === this.currentNoOfResults) {
			this.$inputEl.val(this.currentSearch);
		} else {
			this.$inputEl.val(this.$currentSelectedEl.text());
		}
	},

	assertScreenReader: function(text){
		this.$assertEl.text(text);
	},

	getSearchData: function(){
		var self = this;

		//http://svtse-api.svti.svt.se/program_lists
		$.getJSON('/assets/autocomplete_data.json', function(json) {
			self.searchData = json.data;
		});
	}
};

$(document).ready(function () {
	if ($('#doc-autocomplete').length > 0) {
		AutoComplete.init();
	}
});
