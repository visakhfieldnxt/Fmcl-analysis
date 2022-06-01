/**
 * @author Visakh
 * 
 */


import { Meteor } from 'meteor/meteor';
import { Config } from "../../../api/config/config";
import { StockTransfer } from '../../../api/stockTransfer/stockTransfer';

let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
let toDay = new Date(today);
let nextDay = new Date(toDay);
nextDay.setDate(nextDay.getDate() + 1);

Template.stockTransfer.onCreated(function () {
  const self = this;
  self.autorun(() => {
    // self.subscribe('config.list');
  });
  this.iList = new ReactiveVar();
  this.itemNameArray = new ReactiveVar();
  this.customerNameArray = new ReactiveVar();
  this.branchNameArray = new ReactiveVar();
  this.userNameArray = new ReactiveVar();
  this.itemsDetailsList = new ReactiveVar();
  this.orderData = new ReactiveVar();
  this.customerDetail = new ReactiveVar();
  this.itemArray = new ReactiveVar();
  this.ordId = new ReactiveVar();
  this.totalItem = new ReactiveVar();
  this.printItem = new ReactiveVar();
  this.thisId = new ReactiveVar();
  this.modalLoader = new ReactiveVar();
  this.stockIdEdit = new ReactiveVar();
  this.itemNameOR = new ReactiveVar();
  this.unitNameOR = new ReactiveVar();
  this.selectedItem = new ReactiveVar();
  this.unitSelected = new ReactiveVar();
  this.selecteItemDetil = new ReactiveVar();
  this.itemEditCheck = new ReactiveVar();
  this.editUnitList = new ReactiveVar();
  this.unitNameOrder = new ReactiveVar();
  this.wareHouseArray = new ReactiveVar();
  this.wareHouseDetails = new ReactiveVar();
  this.defWareHouse = new ReactiveVar();
  this.branchCode = new ReactiveVar();

  this.pagination = new Meteor.Pagination(StockTransfer, {
    filters: {
      userId: Meteor.userId(),

    },
    sort: {
      createdAt: -1
    },
    perPage: 20
  });
});

Template.stockTransfer.onRendered(function () {

  //Session.set("iList", []);
  this.iList.set([]);
  this.itemEditCheck.set(false);
  $("#select2-batch").val('').trigger('change');
  /**
   * TODO: Complete JS doc
   */
  $('#select2-batch').select2({
    placeholder: "Select Batch",
    tokenSeparators: [',', ' '],
    allowClear: true
  });
  $('.selectItemsEdit').select2({
    placeholder: "Select Item",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectItemsEdit").parent(),
  });
  $('.selectUnitEdit').select2({
    placeholder: "Select Unit",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectUnitEdit").parent(),
  });
  $('.selectItemWareHouseEdit').select2({
    placeholder: "Select Issue WareHouse",
    tokenSeparators: [','],
    allowClear: true,
    dropdownParent: $(".selectItemWareHouseEdit").parent(),
  });

});
Template.stockTransfer.helpers({
  /**
   * TODO: Complete JS doc
   * @returns {any | *}
   */
  isReady: function () {
    return Template.instance().pagination.ready();
  },
  /**
   * TODO: Complete JS doc
   * @returns {Meteor.Pagination}
   */
  templatePagination: function () {
    return Template.instance().pagination;
  },
  /**
 * TODO:Complete Js doc
 * For listing the item that been selected.
 * 
 */
  itemArrayList: function () {
    return Template.instance().itemArray.get();
  },
  pendingChecker: function (stockStatus) {
    if (stockStatus === 'Pending') {
      return false;
    }
    else {
      return true;
    }
  },
  cancelChecker: function (stockStatus, stockId) {
    if (stockStatus === 'Cancelled') {
      return true;
    }
    else if (stockStatus === 'Pending') {
      return false;
    }
    else if (stockId !== undefined) {
      return true;
    }
    else {
      return false;
    }
  },
  status: function (stockStatus) {
    if (stockStatus === 'Cancelled') {
      return true;
    }
    else {
      return false;
    }
  },
  /**
   * TODO: Complete JS doc
   * @returns {*}
   * 
   */
  orders: function () {
    return Template.instance().pagination.getPage();
  },
  /**
 * TODO:Complete Js doc
 * Getting item list
 */
  itemsList: function () {
    return Template.instance().itemNameOR.get();
  },
  /**
 * TODO:Complete Js doc
 * for getting total weight
 */
  weightCal: (quantity, weight, unitQuantity) => {
    let result = (parseInt(quantity) * Number(weight) * parseInt(unitQuantity)).toFixed(2);
    return result.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
   * TODO: Complete JS doc
   * @returns {Function}
   */
  handlePagination: function () {
    return function (e, templateInstance, clickedPage) {
      e.preventDefault();
      console.log('Changing page from ', templateInstance.data.pagination.currentPage(), ' to ', clickedPage);
    };
  },
  /**
   * TODO: Complete JS doc
   */
  sortIcon: () => {
    genericSortIcons();
  },
  printLoad: () => {
    return Template.instance().modalLoader.get();
  },
  /**
   * TODO:Complete JS doc
   * for getting item details
   */
  items: () => {
    //let itemsList = Session.get("itemsDetailsList");
    let itemsList = Template.instance().itemsDetailsList.get();
    return itemsList;
  },
  /**
* TODO:Complete Js doc
* Digits seperation with Comma
*/
  digitSeperator: (digit) => {
    let res = Number(digit).toFixed(3);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },

  unitList: function () {
    let unit = Template.instance().unitNameOR.get();
    let priceDet = Template.instance().unitSelected.get();
    let itemEditValue = Template.instance().itemEditCheck.get();
    let unitEditValue = Template.instance().editUnitList.get();
    if (itemEditValue === true) {
      Meteor.setTimeout(function () {
        $('#selectUnitEdit').val(unitEditValue).trigger('change');
      }, 100)
    }
    else {
      if (priceDet) {
        Meteor.setTimeout(function () {
          $('#selectUnitEdit').val(priceDet).trigger('change');
        }, 100)
      }
      // else {
      //   Meteor.setTimeout(function () {
      //     if (unit !== '' && unit !== undefined) {
      //       $('#selectUnitEdit').val(unit[0].uomCode).trigger('change');
      //     }
      //   }, 100)
      // }
    }
    return unit;
  },

  /**
   * TODO:Complete JS doc
   * @param docDate
   */
  date: (docDate) => {
    return moment(docDate).format('DD-MM-YYYY');
  },
  /**
   * TODO:Complete JS doc
   * @param docDueDate
   */
  dates: (docDueDate) => {
    let date = moment(docDueDate).format('DD-MM-YYYY');
    if (!date) {
      return '';
    } else {
      return date;
    }
  },
  /**
   * TODO:Complete JS doc
   * @param quantity 
   * formatting discount
   */
  quantityFormat: (quantity) => {
    let res = Number(quantity).toFixed(3);
    return res.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  /**
  * TODO:Complete Js doc
  * Getting wareHouse list
  */
  wareHouseList: function () {
    let wareHouse = Template.instance().wareHouseArray.get();
    let itemEditValue = Template.instance().itemEditCheck.get();
    let defWareHouse = Template.instance().defWareHouse.get();
    let wareHouseEdit = Template.instance().wareHouseDetails.get();
    if (itemEditValue === true) {
      Meteor.setTimeout(function () {
        $('#selectItemWareHouseEdit').val(wareHouseEdit).trigger('change');
      }, 100);
    }
    else {
      if (defWareHouse !== undefined && defWareHouse !== '') {
        Meteor.setTimeout(function () {
          $('#selectItemWareHouseEdit').val(defWareHouse).trigger('change');
        }, 100);
      }
      else {
        Meteor.setTimeout(function () {
          $('#selectItemWareHouseEdit').val('').trigger('change');
        }, 100);
      }
    }
    return wareHouse;
  },
  /**
   * TODO:Complete Js doc
   * for getting item list
   */
  iList: () => {
    //return Session.get("iList");
    return Template.instance().iList.get();
  },
  /**
   * TODO:Complete Js doc
   * for getting item list
   */
  printItemArray: () => {
    //return Session.get("iList");
    return Template.instance().printItem.get();
  },
  /**
   * TODO:Complete Js doc
   * getting logo image for printing
   */
  logo: () => {
    let configLogo = Config.findOne({
      name: "logo"
    });
    if (configLogo !== undefined) {
      return configLogo.value;
    }
  },
  /**
   * TODO:Complete Js doc
   * for getting order details
   */
  ordDetail: () => {
    return Template.instance().orderData.get();
  },
  itemTot: () => {
    let item = Template.instance().printItem.get();
    let total = 0;
    if (item !== undefined) {
      for (let i = 0; i < item.length; i++) {
        total += Number(item[i].transferQty);
      }
      return Number(total).toFixed(2);
    }
  },
  /**
* TODO:Complete JS doc
* @param docDate
* getting time for printing
*/
  printTime: () => {
    return moment(new Date).format('dddd, DD MMMM, YYYY hh:mm:ss a'); //monday 10 jun 2019 11.46.46 a.m
  },
});
Template.registerHelper('incremented', function (index) {
  index++;
  return index;
});
let itemArray = [];
let itemCheck = false;
itemCheckValidation = false;
Template.stockTransfer.events({
  /**
   * TODO: Complete JS doc
   * @param event
   */
  'submit .order-filter': (event) => {
    event.preventDefault();

    let first = $("#fromDate").val();
    let second = $("#toDate").val();

    let dateOne = moment(first, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let dateTwo = moment(second, 'DD-MM-YYYY').format('YYYY-MM-DD');

    let fromDate = new Date(dateOne);
    let toDate = new Date(dateTwo);
    if (fromDate && isNaN(toDate)) {
      fromDate.setDate(fromDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        docDate: {
          $lte: fromDate
        }, userId: Meteor.userId(),

      });
    }
    else if (toDate && isNaN(fromDate)) {
      toDate.setDate(toDate.getDate() + 1);
      Template.instance().pagination.settings.set('filters', {
        docDate: {
          $lte: toDate
        },
        userId: Meteor.userId(),

      });
    }
    else if (fromDate && toDate) {
      if (fromDate.toString() === toDate.toString()) {
        toDate.setDate(toDate.getDate());
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $gte: fromDate, $lt: toDate
          },
          userId: Meteor.userId(),

        });
      }
      else {
        toDate.setDate(toDate.getDate());
        Template.instance().pagination.settings.set('filters', {
          docDate: {
            $gte: fromDate, $lte: toDate
          },
          userId: Meteor.userId(),

        });
      }
    }
    else {
      Template.instance().pagination.settings.set('filters', {});
    }
  },
  /**
   * TODO: Complete JS doc
   * for reset filter
   */
  'click .reset': () => {
    let today = moment(new Date()).format("YYYY-MM-DD 00:00:00.0");
    toDay = new Date(today);
    nextDay = new Date(toDay);
    nextDay.setDate(nextDay.getDate() + 1);
    Template.instance().pagination.settings.set('filters', {
      userId: Meteor.userId(),

    });
    $('form :input').val("");
  },
  /**
   * TODO: Compelete JS doc
   * to view stock transfer create modal
   */
  'click #stockTransfer-create-button': () => {
    $("#stockTransfer-create").modal();
  },
  /**
  * TODO:Complete Js doc
  * for getting item details
  */

  'change #selectItemsEdit ': (event, template) => {
    let supervisor = '';
    let brch = Template.instance().branchCode.get();
    template.selecteItemDetil.set('');
    itemCheckValidation = false;
    template.unitSelected.set('');
    template.defWareHouse.set('');
    $("#quantityEdit").val('');
    $('#selectItemsEdit').find(':selected').each(function () {
      supervisor = $(this).val();
    });
    Meteor.call('unit.itemCode', supervisor, (err, res) => {
      if (!err) {
        template.unitNameOR.set(res);
      }
    });
    template.selectedItem.set(supervisor);
    if (supervisor !== '' && supervisor !== 'Select Item') {
      itemCategoryDetail(supervisor);
      defaulWhsGet(supervisor, brch);
      //Meteor call to take particular item detail
      Meteor.call('item.itemCode', supervisor, (err, result) => {
        if (!err && result !== undefined) {
          template.selecteItemDetil.set(result);
          template.unitSelected.set(result.saleUom);
          let item = result;
          let brand = $('#brandEdit');
          let manufacturer = $('#manufacturerEdit');
          $(brand).html('Brand: ' + item.brand);
          $(manufacturer).html('Manufacturer: ' + item.manufacturer);

        } else {
          let brand = $('#brandEdit');
          let manufacturer = $('#manufacturerEdit');
          $(brand).html('');
          $(manufacturer).html('');
        }
      });
    }
    // Getting itemCategory form item
    function itemCategoryDetail(supervisor) {
      Meteor.call('item.itemCode', supervisor, (error, response) => {
        if (!error) {
          itemDetailresponses = response;
          template.selectedItem.set(response);
          Meteor.call('itemCategory.itemGrpCode', response.itmsGrpCod, (err, res) => {
            if (!err) {
              let itemS = res;
              let itemCategory = $('#itemCategoryEdit');
              $(itemCategory).html('Item Category: ' + itemS.itmsGrpNam);
            } else {
              let itemCategory = $('#itemCategoryEdit');
              $(itemCategory).html('Item Category: ');
            }
          });
        }
      });
    }
    function defaulWhsGet(selecteditem, branchCode) {
      Meteor.call('defaultWareHouse.branchWareHouse', branchCode, selecteditem, (wareHouseErr, wareHouseRes) => {
        if (!wareHouseErr && wareHouseRes !== undefined) {
          // $('#selectItemWareHouseEdit').val(wareHouseRes.whsCode).trigger('change');
          template.defWareHouse.set(wareHouseRes.whsCode);
        }
        else {
          // $('#selectItemWareHouseEdit').val('').trigger('change');
          template.defWareHouse.set('');
        }
      });
    }
  },
  'change #selectUnitEdit ': (event, template) => {
    let unit = '';
    itemCheckValidation = false;
    $('#selectUnitEdit').find(':selected').each(function () {
      unit = $(this).val();
    });
    // console.log("res.....,,");

    let unitArray = Template.instance().unitNameOR.get();
    let ugGet = Template.instance().selecteItemDetil.get();
    if (unitArray) {
      let uniEnty = unitArray.find(x => x.uomCode === unit);
      if (uniEnty) {
        Meteor.call('unit.ugpCodeuomEntry', uniEnty.uomEntry, ugGet.ugpCode, (error, response) => {
          if (!error && response !== undefined) {
            let baseQty = response.baseQty;
            let quantity = $('#unitQuantityShowsEdit');
            $(quantity).html('Base Quantity: ' + Number(baseQty).toFixed(3));
          }
        });
      }
    }

  },
  /**
  * TODO:Complete Js doc
  * for getting item details when click edit button
  */

  'click .stockTransferEditButton': (event, template) => {
    itemCheck = false;
    itemArray = [];
    template.itemArray.set([]);
    template.branchCode.set('');
    Template.instance().modalLoader.set('');
    template.wareHouseArray.set('');
    let ids = event.currentTarget.id;
    template.stockIdEdit.set(ids);
    Session.set("ordIds", ids);
    let editBranchName = ("#editBranchName");
    let editEmployeeName = ('#editEmployeeName');
    let editFromWareHouse = ("#editFromWareHouse");
    let editToWareHouse = ("#editToWareHouse");
    let editDeliveryDate = ("#editDeliveryDate");
    let remarkEdit = ("#remarkEdit");
    let detailUniqueIdEdit = $('#detailUniqueIdEdit');

    $("#selectItemsEdit").val('').trigger('change');
    $("#selectUnitEdit").val('').trigger('change');
    $("#quantityEdit").val('');
    $('#manufacturerEdit').html('');
    $("#unitQuantityShowsEdit").html('');
    $("#itemCategoryEdit").html('');
    $('#brandEdit').html('');

    if (ids) {
      $("#stockeEditDetailPage").modal();
      let header = $('#orderHs');
      $(header).html('Details of Stock Transfer');
      Meteor.setTimeout(function () {
        template.itemNameOR.set('');
      }, 200);
      Meteor.call('stockTransfer.id', ids, (err, res) => {
        if (!err) {
          $(editBranchName).html(res.branchName);
          $(editEmployeeName).html(res.employeeId);
          $(editFromWareHouse).html(res.wareHouseFromName);
          $(editToWareHouse).html(res.wareHouseToName);
          $(editDeliveryDate).html(moment(res.dueDueDate).format("DD-MM-YYYY"));
          $(remarkEdit).html(res.remark_stock);
          if (res.tempId !== undefined && res.tempId !== '') {
            $(detailUniqueIdEdit).html(res.tempId);
          }
          else {
            $(detailUniqueIdEdit).html('');
          }
          // template.modalLoader.set(res);
          template.branchCode.set(res.branch);
          template.itemArray.set(res.itemLines);
          let totalWeightCal = res.weight;
          if (totalWeightCal !== null && totalWeightCal !== undefined) {
            $("#weightTotalEdit").html(((totalWeightCal.toFixed(2)).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
          }
          else {
            $("#weightTotalEdit").html('');
          }
          for (let n = 0; n < res.itemLines.length; n++) {
            itemArray.push(res.itemLines[n]);
          }
          // console.log("itemARR", itemArray);

          branchData(res.branch);
          wareHouseData(res.branch);
        }
      });
      // for getting wareHouse list based on branch
      function wareHouseData(branch) {
        // Getting wareHouseList
        Meteor.call('wareHouse.bPLId', branch, (err, res) => {
          if (!err && res !== undefined) {
            template.wareHouseArray.set(res);
          }
          else {
            template.wareHouseArray.set('');
          }
        });
      }
      // for getting itemlist based on branch
      function branchData(brnch) {
        Meteor.call('itemGetPrice.customerBranchTransfer', brnch, (err, res) => {
          if (!err) {
            template.modalLoader.set(res);
            template.itemNameOR.set(res);
          }
        });
      }
    }

  },
  /**
 * TODO:Complete Js doc
 * for editting items
 */

  'click .stockItemEdit': (event, template) => {
    let ids = event.currentTarget.id;
    let itemLists = Template.instance().itemArray.get();
    template.editUnitList.set('');
    template.wareHouseDetails.set('');
    // console.log("itemLists", itemLists);
    // console.log("itemArrry", itemArray);
    let itemCode = '';
    let itemQuantity = '';
    let uomCode = '';
    let wareHouse = '';
    let itemRemark = '';
    if (itemLists) {
      for (let i = 0; i < itemLists.length; i++) {
        if (itemLists[i].randomId === ids) {
          itemCode = itemLists[i].itemCode;
          itemQuantity = itemLists[i].transferQty;
          uomCode = itemLists[i].transferUom;
          wareHouse = itemLists[i].whsCode;
          itemRemark = itemLists[i].itemRemark;
        }
      }
      $('#selectItemsEdit').val(itemCode).trigger('change');
      template.itemEditCheck.set(true);
      template.editUnitList.set(uomCode);
      template.wareHouseDetails.set(wareHouse);
      $('#quantityEdit').val(itemQuantity);
      $('#itemRemarksEdit').val(itemRemark);
      let itemArrays = Template.instance().itemArray.get();
      let itemIndex = event.currentTarget.id;
      let removeIndex = itemArrays.map(function (item) {
        return item.randomId;
      }).indexOf(itemIndex);
      // remove object
      itemArray.splice(removeIndex, 1);
      template.itemArray.set(itemArray);
      let itemDelete = Template.instance().itemArray.get();
      if (itemDelete !== '' && itemDelete.length > 0) {
        let totalWeightCal = 0;
        for (let s = 0; s < itemArray.length; s++) {
          let multiplication = Number(itemArray[s].transferQty * itemArray[s].unitQuantity * itemArray[s].invWeight);
          totalWeightCal += Number(multiplication);
        }
        let totalWeightC = $('#weightTotalEdit');//changed
        $(totalWeightC).html(((totalWeightCal.toFixed(2)).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));//changed
      }
      else {
        $('#weightTotalEdit').html('');
      }
    }
  },
  /**
  * TODO:Complete Js doc
  * for deleting items
  */

  'click .itemDeleteEdit': (event, template) => {
    itemCheck = true;
    let itemArrays = Template.instance().itemArray.get();
    let itemIndex = event.currentTarget.id;
    let removeIndex = itemArrays.map(function (item) {
      return item.randomId;
    }).indexOf(itemIndex);
    // remove object
    itemArray.splice(removeIndex, 1);
    template.itemArray.set(itemArray);
    let itemDelete = Template.instance().itemArray.get();
    if (itemDelete !== '' && itemDelete.length > 0) {
      let totalWeightCal = 0;
      for (let s = 0; s < itemArray.length; s++) {
        let multiplication = Number(itemArray[s].transferQty * itemArray[s].unitQuantity * itemArray[s].invWeight);
        totalWeightCal += Number(multiplication);
      }
      let totalWeightC = $('#weightTotalEdit');//changed
      $(totalWeightC).html(((totalWeightCal.toFixed(2)).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));//changed
    }
    else {
      $('#weightTotalEdit').html('');

    }
  },
  /**
    * TODO:Complete JS doc
    * @param event
    */
  'click .view': (event, template) => {
    event.preventDefault();
    template.modalLoader.set('');
    //Session.set("itemsDetailsList", '');
    Template.instance().itemsDetailsList.set('');
    let id = event.currentTarget.id;
    //Session.set("ordId", id);
    template.ordId.set(id);
    let header = $('#orderHs');
    let dueDate = $('#detailDocDelivers');
    let docDate = $('#detailDocDates');
    let detailRemark = $('#detailRemark');
    let wareHouseFromName = $('#wareHouseFromName');
    let wareHouseToName = $('#wareHouseToName');
    let stockNoDetail = $('#stockNoDetail');
    let detailApprovedBy = $("#detailApprovedBy");
    let detailApprovedDate = $("#detailApprovedDate");
    let detailApprovedRemark = $("#detailApprovedRemark");
    let weights = $('#detailWeight');
    let detailBranch = $('#detailBranch');
    let detailUniqueId = $('#detailUniqueId');
    $('#orderDetailPage').modal();
    Meteor.call('stockTransfer.id', id, (err, res) => {
      let order = res;
      $(header).html('Details of Stock Transfer');
      $(stockNoDetail).html(order.stockId);
      $(detailRemark).html(order.remark_stock);
      $(wareHouseFromName).html(order.wareHouseFromName);
      $(wareHouseToName).html(order.wareHouseToName);
      $(dueDate).html(moment(order.dueDate).format("DD-MM-YYYY"));
      $(docDate).html(moment(order.docDate).format('DD-MM-YYYY'));
      let weightAmt = Number(order.weight).toFixed(2)
      $(weights).html(weightAmt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      template.itemsDetailsList.set(order.itemLines);
      if (order.tempId !== undefined && order.tempId !== '') {
        $(detailUniqueId).html(order.tempId);
      }
      else {
        $(detailUniqueId).html('');
      }
      $(detailBranch).html(order.branchName);
      template.modalLoader.set(order.itemLines);
      if (order.approvedByName) {
        $(detailApprovedBy).html(order.approvedByName + ' ' + '(Approved)');
        $(detailApprovedDate).html(moment(order.approvedByDate).format("DD-MM-YYYY") + ' ' + '(Approved)');
        $(detailApprovedRemark).html(order.oRRemark + ' ' + '(Approved)');
      }
      else if (order.rejectedByName) {
        $(detailApprovedBy).html(order.rejectedByName + ' ' + '(Rejected)');
        $(detailApprovedDate).html(moment(order.rejectedDate).format("DD-MM-YYYY") + ' ' + '(Rejected)');
        $(detailApprovedRemark).html(order.oRRemark + ' ' + '(Rejected)');
      }
      else if (order.onHoldByName) {
        $(detailApprovedBy).html(order.onHoldByName + ' ' + '(On hold)');
        $(detailApprovedDate).html(moment(order.onHoldDate).format("DD-MM-YYYY") + ' ' + '(On hold)');
        $(detailApprovedRemark).html(order.oRRemark + ' ' + '(On Hold)');
      }
      else {
        $(detailApprovedBy).html('');
        $(detailApprovedDate).html('');
        $(detailApprovedRemark).html('');
      }
    });
  },
  /**
     * TODO:Complete Js doc
     *for add stock transfer item.
     */

  'click .addItemEdit': (event, template) => {
    event.preventDefault();
    let supervisor = '';
    $('#selectItemsEdit').find(':selected').each(function () {
      supervisor = $(this).val();
    });
    if (supervisor === '' || supervisor === 'Select Item') {
      $(window).scrollTop(0);
      setTimeout(function () {
        $("#itemArrayspanEdit").html('<style>#rolesArrayspan{color:#fc5f5f;}</style><span id="rolesArrayspan">Please select a item</span>').fadeIn('fast');
      }, 0);
      setTimeout(function () {
        $('#itemArrayspanEdit').fadeOut('slow');
      }, 3000);
    } else {
      let unitK = '';
      $('#selectUnitEdit').find(':selected').each(function () {
        unitK = $(this).val();
      });
      if (unitK === '' || unitK === 'Select Unit') {
        $(window).scrollTop(0);
        setTimeout(function () {
          $("#unitArrayspanEdit").html('<style>#unitArrayspan{color:#fc5f5f;}</style><span id="unitArrayspan">Please select a Unit</span>').fadeIn('fast');
        }, 0);
        setTimeout(function () {
          $('#unitArrayspanEdit').fadeOut('slow');
        }, 3000);
      }
      else {
        let wareHouseCode = '';
        $('#selectItemWareHouseEdit').find(':selected').each(function () {
          wareHouseCode = $(this).val();
        });
        if (wareHouseCode === '' || wareHouseCode === 'Select Issue WareHouse') {
          $(window).scrollTop(0);
          setTimeout(function () {
            $("#itemWareHouseArrayspanEdit").html('<style>#itemWareHouseArrayspanEdit{color:#fc5f5f;}</style><span id="itemWareHouseArrayspanEdit">Please select wareHouse</span>').fadeIn('fast');
          }, 0);
          setTimeout(function () {
            $('#itemWareHouseArrayspanEdit').fadeOut('slow');
          }, 3000);
        }
        else {
          let quantity = $("#quantityEdit").val();
          let transferredQty = quantity;
          if (quantity === '' || Number(quantity) === 0) {
            $(window).scrollTop(0);
            setTimeout(function () {
              $("#quantityArrayspanEdit").html('<style>#quantityArrayspanEdit{color:#fc5f5f;}</style><span id="quantityArrayspanEdit">Please enter a quantity </span>').fadeIn('fast');
            }, 0);
            setTimeout(function () {
              $('#quantityArrayspanEdit').fadeOut('slow');
            }, 3000);
          }
          else {
            $(".addItemEdit").prop('disabled', true);
            Meteor.setTimeout(function () {
              $(".addItemEdit").prop('disabled', false);
            }, 3000);
            $("#deliveryArrayspan").html('<style>#deliveryArrayspan{color:#fc5f5f;}</style><span id="deliveryArrayspan"></span>');
            let itemNameList = supervisor;
            let itemWareHouseName = '';
            let itemRemarks = $('#itemRemarksEdit').val();
            let ugGet = Template.instance().selecteItemDetil.get();
            if (itemArray.length > 0) {
              for (let i = 0; i < itemArray.length; i++) {
                if (supervisor === itemArray[i].itemCode) {
                  itemCheckValidation = true;
                  toastr['error'](itemAlreadyExistsMessage);
                  break;
                }
                else {
                  itemCheckValidation = false;
                }
              }
            }
            //Meteor call to take item wareHouse detail
            Meteor.call('wareHouse.wareHouseName', wareHouseCode, (err, res) => {
              if (!err) {
                itemWareHouseName = res.whsName;
              }
            })

            //Meteor call to take particular item detail
            Meteor.call('item.itemCode', supervisor, (error, response) => {
              if (!error) {
                let itemDetail = response;
                itemDetails(itemDetail);
              }
            });
            function itemDetails(itemDetail) {
              // let unitUgmCode = response.ugpCode;
              //Meteor call to take particular unit detail
              Meteor.call('unit.uomCodeUgpCode', unitK, supervisor, (unitErr, unitData) => {
                if (!unitErr) {
                  let unitDetail = unitData;
                  // Meteor.call('unit.uomEntryGet', itemDetail.ugpCode, itemDetail.invntryUom, (err, res) => {
                  //   if (!err) {
                  //     console.log("res...", res.uomEntry);
                  //     let uomData = res; 
                  let quantityValue = (quantity * unitDetail.baseQty).toString();
                  // console.log("quantity", quantity);

                  let randomId = Random.id();
                  let itemObject = {
                    randomId: randomId,
                    uoMEntry: itemDetail.saleUoMEntry,
                    uomCode: itemDetail.saleUoMEntry,
                    unitQuantity: unitDetail.baseQty,
                    itemCode: itemNameList,
                    itemNam: itemDetail.itemNam,
                    transferUom: unitDetail.uomCode,
                    transferQty: transferredQty,
                    quantity: quantityValue,
                    uomCodeName: itemDetail.saleUom,
                    whsCode: wareHouseCode,
                    invWeight: ugGet.invWeight,
                    itemRemark: itemRemarks,
                    itemWareHouseName: itemWareHouseName,
                    updatedAt: new Date(),
                  };
                  if (itemCheckValidation === false) {
                    itemCheck = true;
                    itemArray.push(itemObject);
                    template.itemArray.set(itemArray);
                    itemDataClear();

                  }
                  let totalWeightCal = 0;
                  for (let s = 0; s < itemArray.length; s++) {
                    let multiplication = Number(itemArray[s].transferQty * itemArray[s].unitQuantity * itemArray[s].invWeight);
                    totalWeightCal += Number(multiplication);
                  }
                  let totalWeightC = $('#weightTotalEdit');
                  $(totalWeightC).html(((totalWeightCal.toFixed(2)).toString()).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                  //   }
                  // });
                }
              });
            }
            function itemDataClear() {
              $("#selectItemsEdit").val('').trigger('change');
              $("#selectUnitEdit").val('').trigger('change');
              $("#quantityEdit").val('');
              clearFields('quantity', 'price', 'discount', 'discountAmount')
              $("#discountAmount:input").prop('disabled', false);
              $("#discount:input").prop('disabled', false);
              let brand = $('#brandEdit');
              let manufacturer = $('#manufacturerEdit');
              $('#itemRemarksEdit').val('');
              $(brand).html('');
              $(manufacturer).html('');
              let itemCategory = $('#itemCategoryEdit');
              $(itemCategory).html('');
              template.selecteItemDetil.set('');
              itemCheckValidation = false;
              template.itemEditCheck.set(false);
              template.editUnitList.set('');
              $('#unitQuantityShowsEdit').html('');
              $('#selectItemWareHouseEdit').val('').trigger('change');
              $('#itemRemarksEdit').val('');
            }
          }
          $("#quantityArrayspanEdit").html('<style>#quantityArrayspan{color:#fc5f5f;}</style><span id="quantityArrayspan"></span>');
        }
        $("#itemArrayspanEdit").html('<style>#rolesArrayspan{color:#fc5f5f;}</style><span id="rolesArrayspan"></span>');
      }
    }
  },
  /**
 * TODO:Complete Js doc
 * for final submition
 */
  'submit .stockTrasferEdit': (event, template) => {
    event.preventDefault();
    let itemArList = Template.instance().itemArray.get();
    for (let x = 0; x < itemArList.length; x++) {
      itemArList[x].baseLine = x.toString();
    }
    template.itemArray.set(itemArList);

    if (itemArray.length === 0) {
      toastr["error"](itemValidation);
    } else {
      let weight = 0;
      // function weightCalculaiton(weight) {
      for (let i = 0; i < itemArList.length; i++) {
        let multiplication = Number(itemArList[i].transferQty * itemArList[i].unitQuantity * itemArList[i].invWeight);
        weight += Number(multiplication);
      }
      let orderId = Session.get("ordIds");
      $("#submit").attr("disabled", true);
      if (itemCheck === true) {
        // console.log("weight1", weight);
        editORUpdateStockTransfer(orderId, itemArList, weight);
        dataClear();
        $('#stockeEditDetailPage').modal('hide');
      }
      else {
        Meteor.call('stockTransfer.id', orderId, (err, res) => {
          editORUpdateStockTransfer(orderId, res.itemLines, res.weight);
          dataClear();
          $('#stockeEditDetailPage').modal('hide');
        });
      }
    }
    function dataClear() {
      // $('form :input').val("");
      itemArray = [];
      Session.set("ordIds", '');
      template.itemArray.set('');
      template.selectedItem.set('');
      let brand = $('#brandEdit');
      let manufacturer = $('#manufacturerEdit');
      $(brand).html('');
      $(manufacturer).html('');
      itemCheckValidation = false;
      itemCheck = false;
      template.itemEditCheck.set(false);
      template.editUnitList.set('');
      $('#unitQuantityShowsEdit').html('');
      $("#selectItemsEdit").val('').trigger('change');
      $("#selectUnitEdit").val('').trigger('change');
      template.wareHouseArray.set('');
      $('#itemRemarksEdit').val('');
      $('#selectItemWareHouseEdit').val('').trigger('change');
    }
  },
  /**
* TODO: Compelete JS doc
* for change the value of unit
*/
  'click #selectItemsEditDiv': (event, template) => {
    template.itemEditCheck.set(false);
  },

  /**
   * TODO: Complete JS doc
   * for show filter display
   */
  'click #filterSearch': () => {
    document.getElementById('filterDisplay').style.display = "block";
  },
  /**
   * TODO: Complete JS doc
   * to hide filter display
   */
  'click #removeSearch': () => {
    document.getElementById('filterDisplay').style.display = "none";
  },

  /**
   * TODO: Complete JS doc
   * clear data when click close button
   */
  'click .close': (event, template) => {
    $('#weightTotalEdit').html('');
    template.selecteItemDetil.set('');
    template.itemsDetailsList.set('');
    template.itemArray.set('');
    template.modalLoader.set('');
    $("#submit").attr("disabled", false);
    $('#itemRemarksEdit').val('');
    template.itemEditCheck.set(false);
    template.editUnitList.set('');
    $('#unitQuantityShowsEdit').html('');
    template.wareHouseArray.set('');
    itemCheckValidation = false;
  },
  /**
  * TODO:Complete Js doc
  * for clear data when click close button
  */

  'click .closeEdit': (event, template) => {
    Session.set("ordIds", '');
    itemArray = [];
    template.itemArray.set('');
    $('#selectItemsEdit').val('').trigger('change');
    $('#selectUnitEdit').val('').trigger('change');
    $('#quantityEdit').val('');
    $('#itemCategoryEdit').html('');
    $('#brandEdit').html('');
    $('#manufacturerEdit').html('');
    template.modalLoader.set('');
    template.itemEditCheck.set(false);
    template.wareHouseArray.set('');
    $('#itemRemarksEdit').val('');
    template.editUnitList.set('');
    itemCheck = false;
    itemCheckValidation = false;
    $('#unitQuantityShowsEdit').html('');
    $('#selectItemWareHouseEdit').val('').trigger('change');

  },
  /**
  * TODO: Complete JS doc
  * clear data when click close button
  */
  'click .closen': (event, template) => {
    template.itemsDetailsList.set('');
    template.itemArray.set('');
    template.modalLoader.set('');
    $("#submit").attr("disabled", false);
    template.itemEditCheck.set(false);
    template.editUnitList.set('');
    template.printItem.set('');
    template.thisId.set('');
    template.orderData.set('');
    $('#printBy').html('');
    $('#approvedName').html('');
  },
  /**
   * TODO:Complete Js doc
   * for printing order details
   */
  'click .print': (event, template) => {
    event.preventDefault();
    $('#printDetailPage').modal();
    template.modalLoader.set('');
    template.printItem.set('');
    template.thisId.set('');
    template.orderData.set('');
    let id = event.currentTarget.id;
    let branchNamePrint = $('#branchNamePrint');
    let branchAddressPrint = $('#branchAddressPrint');
    let printPloteNo = ('#branchPloteNoPrint');
    let approvedByName = ('#approvedName');
    let printBy = ('#printBy');
    Meteor.call('stockTransfer.id', id, (err, res) => {
      if (!err) {
        template.orderData.set(res);
        template.thisId.set(id);
        branchForPrint(res.branch);
        printByName(Meteor.userId());
        template.printItem.set(res.itemLines);
        // template.modalLoader.set(res.itemLines);
        if(res.approvedByName!== undefined && res.approvedByName!=='')
        {
        $(approvedByName).html(res.approvedByName);
        }
        else
        {
          $(approvedByName).html('-');
        }
      }
    });
    // getting branch details
    function branchForPrint(branch) {
      Meteor.call('branch.branchDetail', branch, (branchError, branchResult) => {
        if (!branchError) {
          $(branchNamePrint).html(branchResult.bPLName);
          $(branchAddressPrint).html(branchResult.address);
          $(printPloteNo).html(branchResult.streetNo);
          template.modalLoader.set(branchResult);
        }
      });
    }
    function printByName(id) {
      Meteor.call('user.idAuthorizedBy', id, (userError, userResult) => {
        if (!userError) {
          $(printBy).html(userResult.profile.firstName);
        }
      });
    }
    Template.stockTransfer.__helpers.get('ordDetail').call();
  },
  /**
 * TODO: Complete JS doc
 * for print data
 */
  'click .printThis': () => {
    // window.print();
    $("#printSection").printThis({
      // header: $("#divHeader").html(),
      // footer: $("#divFooter").html()
    });
    let thisId = Template.instance().thisId.get();
    Meteor.call('stockTransfer.printSlipCheck', thisId, (err, res) => {
      if (!err) {

      }
    });
  },

  /**
  * TODO:Complete Js doc
  *Remove sales order
  */
  'click .stockTransferCancel': (event) => {
    event.preventDefault();
    let header = $('#userHeader');
    let confirmedUuid = $('#confirmedUuid');
    $('#stockTransferDelConfirmation').modal();
    let _id = event.currentTarget.attributes.id.value;
    $(header).html('Confirm Deletion');
    $(confirmedUuid).val(_id);
  },
  'click #stockTransferRemove': (event) => {
    event.preventDefault();
    let _id = $('#confirmedUuid').val();
    if (_id && $.trim(_id)) {
      Meteor.call('stockTransfer.delete', $.trim(_id), (error) => {
        if (error) {
          $('#stockTransferErrorModal').modal();
          $('#stockTransferErrorModal').find('.modal-body').text("Internal error - unable to remove entry. Please try again");
        } else {
          $('#stockTransferSuccessModal').modal();
          $('#stockTransferSuccessModal').find('.modal-body').text('Stock transfer cancelled successfully');
        }
        $("#stockTransferDelConfirmation").modal('hide');
      });
    }
  },
});
/**
  * TODO:Complete Js doc
  * for clear data when click close button
  */
function clearFields(elements) {
  if (typeof elements === "string") {
    $("#" + elements).val('');
  }
  else {
    elements.forEach((elem) => {
      $("#" + elem).val('')
    })
  }
}
