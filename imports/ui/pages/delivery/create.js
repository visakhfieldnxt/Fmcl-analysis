import { Meteor } from 'meteor/meteor';
Template.user_create.onCreated(function () {
    Blaze._allowJavascriptUrls();
    let self = this;
    self.autorun(() => {
    });
  });
Template.delivery_create.events({
    'submit .delivery-add': (event) => {
        event.preventDefault();
        tid=0;
        createOrUpdateDelivery(event.target);
        
      },
      'keyup #deliveryPrec':() => {
        if($('#deliveryPrec').val()>100){
          $('#deliveryPrec').val(100);
        }
        if($('#deliveryPrec').val()<0){
          $('#deliveryPrec').val(0);
        } 
        if(isNaN($('#deliveryPrec').val())){
          $('#deliveryPrec').val(0);
        }
      }
});
Template.delivery_create.onRendered(function () {
  $('.selectStatusdelivery').select2({
    placeholder: "Select Status",
    tokenSeparators: [','],
    allowClear: true
  });
});