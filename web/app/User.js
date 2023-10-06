class User {
    // subject to change


    // initializes user with just email and password from signu[]
    constructor(email, password, initialUsername) {
        this.email = email;

        //TODO add encryption for the database (bcrypt seems easy)
        this.password = password;
        this.username = initialUsername;

        this.location = '';
        this.age = '';
        this.phone = null;
    }

    // takes in user object from database for login
/*    constructor(email, password, username, location, age, phone) {

        this.email = email;
        this.password = password;
        this.username = username;

        this.location = location;
        this.age = age;
        this.phone = phone;

        // TODO add other fields for a user

    } */

    // adds new field to a user - username, age etc.
    addField(fieldName, val) {
        this[fieldName] = val;
    }


}

export default User;