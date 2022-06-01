/**
 * @author Nithin
 */
import { Meteor } from 'meteor/meteor';
let latitude = '';
let longitude = '';
Template.outletCreate.onCreated(function () {

  const self = this;
  self.autorun(() => {

  });
  this.inSideImgVal = new ReactiveVar();
  this.outSideImgVal = new ReactiveVar();
});

Template.outletCreate.onRendered(function () {
  // get locations
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  function success(pos) {
    var crd = pos.coords;
    latitude = crd.latitude;
    longitude = crd.longitude;
  }
  function error(err) {
    // console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  navigator.geolocation.getCurrentPosition(success, error, options);
  $('.outletTypeVal').select2({
    placeholder: "Select Outlet Type",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".outletTypeVal").parent(),
  });
  $('.outletClassVal').select2({
    placeholder: "Select Class",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".outletClassVal").parent(),
  });
});
Template.outletCreate.helpers({

});
Template.outletCreate.events({
  /**
    * TODO: Complete JS doc
   */
  'click .closeOutlet': (event, template) => {
    $('#outletAdds').each(function () {
      this.reset();
    });
    $('.outletAdds').each(function () {
      document.getElementById("outsideImgs").src = '';
    });
    $('.outletAdds').each(function () {
      document.getElementById("insideImgs").src = '';
    });
    $('#outletTypeVal').val('').trigger('change');
    $('#outletClassVal').val('').trigger('change');
  },
  /**
   * TODO: Complete JS doc
   */
  'blur #email': () => {
    let emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    let emailaddress = $("#email").val();
    if (!emailReg.test(emailaddress))

      $("#emailspan").html('<style>#emailspan{color:#fc5f5f;}</style><span id="emailspan">Please enter the valid email address</span>');
    else
      $("#emailspan").html('<style>#emailspan{color:#fc5f5f;}</style>')
  },
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .outletAdds': (event, template) => {
    event.preventDefault();
    let insideImage = Template.instance().inSideImgVal.get();
    let outsideImgs = Template.instance().outSideImgVal.get();
    let outletType = '';
    $('#outletTypeVal').find(':selected').each(function () {
      outletType = ($(this).val());
    });
    let outletClass = '';
    $('#outletClassVal').find(':selected').each(function () {
      outletClass = ($(this).val());
    });
    if (insideImage == '' || insideImage === null || insideImage === undefined) {
      toastr["error"]('Upload Inside Image !');
    }
    else {
      if (outsideImgs === '' || outsideImgs === null || outsideImgs === undefined) {
        toastr["error"]('Upload Outside Image !');
      }
      else {
        createOrUpdateOutlet(event.target, insideImage, outsideImgs, Meteor.userId(), latitude, longitude, outletType, outletClass);
        $('#ic-create-Outlet').modal('hide');
        dataClear();
      }
    }
    function dataClear() {
      $('#outletAdds').each(function () {
        this.reset();
      });
      $('.outletAdds').each(function () {
        document.getElementById("outsideImgs").src = '';
      });
      $('.outletAdds').each(function () {
        document.getElementById("insideImgs").src = '';
      });
      template.inSideImgVal.set('');
      template.outSideImgVal.set('');
      $('#outletTypeVal').val('').trigger('change');
      $('#outletClassVal').val('').trigger('change');
    }
  },

  /**
* TODO:Complete Js doc
* set image array
*/
  'change .file-upload-input': (event, template) => {
    let myTimeOut = '';
    $(".loadersSpinsImgIn").attr("style", "display:none");
    $('#insideImgs').css('display', 'none');
    let myFile = $('.file-upload-input').prop('files')[0];
    let fileType = myFile["type"];
    let ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
    template.inSideImgVal.set('');
    // let size= ;
    if ($.inArray(fileType, ValidImageTypes) < 0) {
      toastr['error']('File type not allowed.You can only upload GIF, JPG, PNG files.');
    } else if ((myFile.size) / 1024 > 9000) {
      toastr['error']('Please image size less than 9mb');
    }
    else {
      if (myFile !== undefined && myFile !== '') {
        let imageGet = false;
        $(".loadersSpinsImgIn").attr("style", "display:block");
        // console.log("myFile", myFile);
        if ((myFile.size) / 1024 < 9000 && (myFile.size) / 1024 > 700) {
          // console.log("myFile.size", myFile.size);
          let fileReader = new FileReader();
          fileReader.onload = function () {
            if (imageGet === false) {
              myTimeOut = Meteor.setInterval(function () {
                let image = new Image();
                // image.onload = function () {
                image.src = fileReader.result;
                let canvas = document.createElement("canvas");
                let context = canvas.getContext("2d");
                canvas.width = image.width / 5;
                canvas.height = image.height / 5;
                context.drawImage(image,
                  0,
                  0,
                  image.width,
                  image.height,
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );
                // console.log("canvas", canvas)
                let imageDataVal = canvas.toDataURL();
                if (imageDataVal !== undefined &&
                  imageDataVal !== '' && imageDataVal !== 'data:,') {
                  if (imageGet === false) {
                    imageGets(imageDataVal);
                    myStopFunction()
                  }
                  imageGet = true;
                }
              }, 1000);
            }
            // console.log("imageGet", imageGet);
            function imageGets(imageDataVal) {
              $('#insideImgs').attr('src', imageDataVal);
              $('#insideImgs').css('display', 'inline');
              template.inSideImgVal.set(imageDataVal);
              $(".loadersSpinsImgIn").attr("style", "display:none");
            }
            function myStopFunction() {
              clearInterval(myTimeOut);
            }
          }
          fileReader.readAsDataURL(myFile);
        }
        else {
          let fileReader = new FileReader();
          fileReader.onload = function () {
            $('#insideImgs').attr('src', fileReader.result);
            $('#insideImgs').css('display', 'inline');
            template.inSideImgVal.set(fileReader.result);
            $(".loadersSpinsImgIn").attr("style", "display:none");
          }
          fileReader.readAsDataURL(myFile);
        }
      }
    }
    $('.file-upload-input').val('');
  },

  /**
* TODO:Complete Js doc
* set image array
*/
  'change .file-upload-inputOut': (event, template) => {
    let myTimeOut = '';
    $(".loadersSpinsImg").attr("style", "display:none");
    $('#outsideImgs').css('display', 'none');
    let myFile = $('.file-upload-inputOut').prop('files')[0];
    let fileType = myFile["type"];
    let ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
    template.outSideImgVal.set('');
    // let size= ;
    if ($.inArray(fileType, ValidImageTypes) < 0) {
      toastr['error']('File type not allowed.You can only upload GIF, JPG, PNG files.');
    } else if ((myFile.size) / 1024 > 9000) {
      toastr['error']('Please image size less than 9mb');
    }
    else {
      if (myFile !== undefined && myFile !== '') {
        let imageGet = false;
        $(".loadersSpinsImg").attr("style", "display:block");
        // console.log("myFile", myFile);
        if ((myFile.size) / 1024 < 9000 && (myFile.size) / 1024 > 700) {
          // console.log("myFile.size", myFile.size);
          let fileReader = new FileReader();
          fileReader.onload = function () {
            if (imageGet === false) {
              myTimeOut = Meteor.setInterval(function () {
                let image = new Image();
                // image.onload = function () {
                image.src = fileReader.result;
                let canvas = document.createElement("canvas");
                let context = canvas.getContext("2d");
                canvas.width = image.width / 5;
                canvas.height = image.height / 5;
                context.drawImage(image,
                  0,
                  0,
                  image.width,
                  image.height,
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );
                // console.log("canvas", canvas)
                let imageDataVal = canvas.toDataURL();
                if (imageDataVal !== undefined &&
                  imageDataVal !== '' && imageDataVal !== 'data:,') {
                  if (imageGet === false) {
                    imageGets(imageDataVal);
                    myStopFunction()
                  }
                  imageGet = true;
                }
              }, 1000);
            }
            // console.log("imageGet", imageGet);
            function imageGets(imageDataVal) {
              $('#outsideImgs').attr('src', imageDataVal);
              $('#outsideImgs').css('display', 'inline');
              template.outSideImgVal.set(imageDataVal);
              $(".loadersSpinsImg").attr("style", "display:none");
            }
            function myStopFunction() {
              clearInterval(myTimeOut);
            }
          }
          fileReader.readAsDataURL(myFile);
        }
        else {
          let fileReader = new FileReader();
          fileReader.onload = function () {
            $('#outsideImgs').attr('src', fileReader.result);
            $('#outsideImgs').css('display', 'inline');
            template.outSideImgVal.set(fileReader.result);
            $(".loadersSpinsImg").attr("style", "display:none");
          }
          fileReader.readAsDataURL(myFile);
        }
      }
    }
    $('.file-upload-inputOut').val('');
  },
});
