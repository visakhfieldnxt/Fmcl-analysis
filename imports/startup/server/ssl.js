/**
 * @author Visakh
 */

 Meteor.startup(() => {

//     SSLProxy({
//       port: 443, //or 443 (normal port/requires sudo)S
//       ssl : {
//            key: Assets.getText("private.pem"),
//            cert: Assets.getText("certificate.pem"),
  
//            //Optional CA
//           //  Assets.getText("ca.pem")
//       }
//    });
SSL('/home/ubuntu/private/private.key','/home/ubuntu/private/certificate.crt', 443);
});