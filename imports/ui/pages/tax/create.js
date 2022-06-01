import { Meteor } from 'meteor/meteor';
Template.user_create.onCreated(function () {
    Blaze._allowJavascriptUrls();
    let self = this;
    self.autorun(() => {
    });
  });
Template.tax_create.events({
    'submit .tax-add': (event) => {
        event.preventDefault();
        tid=0;
        createOrUpdateTax(event.target);
        
      },
      'keyup #taxPrec':() => {
        if($('#taxPrec').val()>100){
          $('#taxPrec').val(100);
        }
        if($('#taxPrec').val()<0){
          $('#taxPrec').val(0);
        } 
        if(isNaN($('#taxPrec').val())){
          $('#taxPrec').val(0);
        }
      }
});
Template.tax_create.onRendered(function () {
  $('.selectStatustax').select2({
    placeholder: "Select Status",
    tokenSeparators: [','],
    allowClear: true
  });
});