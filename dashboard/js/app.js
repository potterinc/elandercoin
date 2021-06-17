/**UI Navigation controls */
$('#investment').click((() => $('#ui-wrapper').load('investments.html')));
$('#transaction-history').click((() => $('#ui-wrapper').load('transaction_history.html')))


// Login Asychronous Request
$('#SignIn').click(() => {
    authenticate.validateInput('validateLogin') // Form Validation

    //Signing In
    if (authenticate.flag == true) {
        Login.signIn();
        authenticate.flag = false;
        return authenticate.flag;
    }
});

// New User Registration
$('#SignUp').click(() => {
    authenticate.validateInput('validateUser');
    if (authenticate.flag == true) {
        login.SignUp();
        authenticate.flag = false;
        return authenticate.flag;
    }
})

// logout
$('#logout').click(() => {
    Login.logout();
})




var Login = {
    Email: $('#LoginEmail'),
    Password: $('#LoginPassword'),
    loginSession: () => {
        if (localStorage.getItem('status') === 'true') {
            $('.menu-title').html(localStorage.getItem('name'))
            $('#userID').html(localStorage.getItem('id'))
            $('#owner').val(localStorage.getItem('name'));
            $('#owner-phone').val(localStorage.getItem('telephone'))
        }
        else
            location.href = 'index.html';
    },
    logout: () => {
        localStorage.clear();
        location.href = 'index.html';
    },
    activeSession: () => {
        if (localStorage.getItem('status') == 'true')
            location.href = 'main.html';
    },
    signIn: () => {
        $.ajax({
            url: 'https://filmplace.potterincorporated.com/config/auth.php',
            type: authenticate.type.POST,
            dataType: authenticate.JSON,
            beforeSend: () => {
                $('#SignIn').html('<img src="./images/preloader/fading_circles.gif" width="50" />');
            },
            data: {
                loginEmail: Login.Email.val(),
                loginPassword: Login.Password.val(),
            },
            success: (asyncRequest) => {
                Login.Email.val(null);
                Login.Password.val(null);
                if (asyncRequest.Status === true) {
                    localStorage.setItem('name', asyncRequest.fullName);
                    localStorage.setItem('status', asyncRequest.Status);
                    localStorage.setItem('id', asyncRequest.userId);
                    localStorage.setItem('telephone', asyncRequest.telephone);
                    location.href = './main.html';
                }
                else
                    $('#loginStatus').html(asyncRequest.Message);
                $('#SignIn').html('Sign In');

                setTimeout(() => {
                    $('#loginStatus').fadeOut(1000);
                }, 5000);

                $('#loginStatus').val(null).show();
            }
        })

    },
    signUp: () => {
        $.ajax({
            url: 'https://filmplace.potterincorporated.com/config/auth.php',
            type: authenticate.type.POST,
            dataType: authenticate.JSON,
            data: {
                fullName: SignUp.fullName.val(),
                newUserEmail: SignUp.Email.val(),
                telephone: SignUp.telephone.val(),
                NewSecurityQuestion: SignUp.Question.val(),
                answer: SignUp.Answer.val(),
                password: SignUp.Password.val(),
                dateOfRegistration: SignUp.getToday()
            },
            beforeSend: () => {
                $('#SignUp').html('<img src="./images/preloader/fading_circles.gif" width="32" />');
            },
            success: (asyncRequest) => {
                SignUp.fullName.val(null);
                SignUp.Email.val(null);
                SignUp.telephone.val(null);
                SignUp.Question.val('null');
                SignUp.Answer.val(null);
                SignUp.Password.val(null);
                $('#SignUp').html('Sign Up');

                $('#SignUpNotification').html(asyncRequest.Message);
                setTimeout(() => {
                    $('#SignUpNotification').fadeOut(1000);
                    $('#SignUpNotification').val(null).show();
                    location.href = 'index.html';
                }, 5000)
            }
        })
    }
}

var SignUp = {
    fullName: $('#FullName'),
    telephone: $('#Telephone'),
    Question: $('#NewQuestion'),
    Email: $('#NewEmail'),
    Answer: $('#NewAnswer'),
    Password: $('#NewPassword'),
    /**
     * Get the current date of the client system in YYYY-DD-MM format
     */
    getToday: () => {
        // const monthNames = ["January", "February", "March", "April", "May", "June",
        //     "July", "August", "September", "October", "November", "December"];
        let dateObj = new Date();
        let month = String(dateObj.getMonth()).padStart(2, '0');
        let day = String(dateObj.getDate()).padStart(2, '0');
        let year = dateObj.getFullYear();
        let output = year + "-" + month + "-" + day;
        return output;
    }
}

var authenticate = {
    flag: false,
    Email: $('#Email'),
    Password: $('#ResetPassword'),
    JSON: 'JSON',
    type: { POST: 'POST', GET: 'GET' },
    Question: $('#SecurityQuestion'),
    Answer: $('#Answer'),
    ChangePassword: $('#Reset'), //Change Password markup
    verifiedUserId: $('#VerifiedUserId'),
    confirmNewPassword: $('#ConfirmResetPassword'),
    validateInput: (inputArgs) => {
        let validInput = $('[' + inputArgs + ']');
        for (let formInput = 0; formInput < validInput.length; formInput++) {
            if (validInput.get(formInput).value == null || validInput.get(formInput).value == '') {
                validInput[formInput].placeholder = 'This field is required';
                return false;
            }
        }
        authenticate.flag = true;
    }
}