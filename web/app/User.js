class User {
    // subject to change


    // initializes user with just email and password from signu[]
    constructor(email, username, firstName, lastName, phone, age, location, gender) {
        this.email = email;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName
        this.phone = phone;
        this.location = location;
        this.age = age;
        this.gender = gender;
    }

    // adds new field to a user - username, age etc.
    addField(fieldName, val) {
        this[fieldName] = val;
    }


}

export default User;