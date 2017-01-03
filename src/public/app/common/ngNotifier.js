angular.module('app').value('ngToastr',toastr);

angular.module('app').factory('ngNotifier',function(ngToastr) {
	return {
		notifyError: function(msg) {
			ngToastr.options = {
				'positionClass':'toast-top-full-width',
				'timeOut' : '2600',
				'closeButton' : true,
				'preventDuplicates' : true
			};
			ngToastr.error(msg);
			//console.log(msg);
		},
		notify: function(msg) {
			ngToastr.options = {
				'positionClass':'toast-top-center',
				'timeOut' : '2600',
				'closeButton' : true,
				//'preventDuplicates' : true
			};
			ngToastr.success(msg);
			//console.log(msg);
		}
	}
})