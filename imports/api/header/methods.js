/**
 * @author Visakh
 */
Meteor.methods({
  /**
   * @param id
   * @param imageData
   * @param firstName
   * @param lastName
   * @param gender
   * @param dateOfBirth
   */
  'profile.updateProfile': (id, imageData, firstName, lastName, gender, dateOfBirth) => {
    let userObject = {
      profile: {
        image: imageData,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dateOfBirth: dateOfBirth,
        isDeleted: false
      },
    };
    if (id) {
      let user = Meteor.users.findOne({ _id: id });
      if (user) {
        user.updatedBy = Meteor.user().username;
        user.updatedAt = new Date();
        _.map(userObject, (value, key) => {
          user[key] = value;
        });

        return Meteor.users.update({ _id: id }, user);
      }
    }
  },
  /**
    * @param id
    * @param imageData
    * @param firstName
    * @param lastName
    * @param gender
    * @param dateOfBirth
    */
  'profile.updateVansaleProfile': (id, imageData, firstName, lastName, gender, dateOfBirth,
    transporterName, vehicleNumber, driverName, driverNumber, lorryBoy) => {
    let userObject = {
      profile: {
        image: imageData,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dateOfBirth: dateOfBirth,
        isDeleted: false
      },
    };
    if (id) {
      let user = Meteor.users.findOne({ _id: id });
      if (user) {
        user.updatedBy = Meteor.user().username;
        user.updatedAt = new Date();
        user.transporterName = transporterName;
        user.vehicleNumber = vehicleNumber;
        user.driverName = driverName;
        user.driverNumber = driverNumber;
        user.lorryBoy = lorryBoy;
        _.map(userObject, (value, key) => {
          user[key] = value;
        });
        return Meteor.users.update({ _id: id }, user);
      }
    }
  }
});
