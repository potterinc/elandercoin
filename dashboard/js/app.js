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
        if (Investor.Password.verify.val() != Investor.Password.signUp.val() || Investor.Password.signUp.val().length < 6) {
            Investor.errorMsg = "Password does not match or too short"
            $('#SignUpNotification').html(Investor.errorMsg).addClass("alert alert-danger");
            setTimeout(() => {
                $('#SignUpNotification').fadeOut(1000);
            }, 5000)
            $('#SignUpNotification').val(null).show();
            Investor.errorMsg = null;
        } else {
            Login.signUp();
            authenticate.flag = false;
            return authenticate.flag;
        }
    }
})

// logout
$('#logout').click(() => {
    Login.logout();
})




const Login = {
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
            url: 'src/auth.php',
            type: authenticate.type.POST,
            dataType: authenticate.JSON,
            beforeSend: () => {
                $('#SignIn').html('<img src="dashboard/images/preloader/fading_circles.gif" />');
            },
            data: {
                loginEmail: Investor.Email.login.val(),
                loginPassword: Investor.Password.login.val(),
            },
            success: (asyncRequest) => {
                Login.Email.login.val(null);
                Login.Password.login.val(null);
                $('#SignIn').html('LOGIN');
                if (asyncRequest.Status === true) {
                    localStorage.setItem('username', asyncRequest.username);
                    localStorage.setItem('status', asyncRequest.Status);
                    localStorage.setItem('id', asyncRequest.clientId);
                    localStorage.setItem('email', asyncRequest.email);
                    location.href = 'dashboard/';
                }
                else {
                    $('#loginStatus').html(asyncRequest.error).addClass('alert alert-danger');
                    $('#SignIn').html('LOGIN');
                }

                setTimeout(() => {
                    $('#loginStatus').fadeOut(1000);
                }, 5000);

                $('#loginStatus').val(null).show();
            }
        })

    },
    signUp: () => {
        $.ajax({
            url: 'src/auth.php',
            type: authenticate.type.POST,
            dataType: authenticate.JSON,
            beforeSend: () => $('#SignUp').html('<img src="dashboard/images/preloader/fading_circles.gif" />'),
            data: {
                email: Investor.Email.signUp.val(),
                password: Investor.Password.signUp.val(),
                username: Investor.username.val(),
                dateOfRegistration: Investor.getToday()
            },
            success: (asyncRequest) => {
                Investor.Email.signUp.val(null);
                Investor.Password.signUp.val(null);
                Investor.Password.verify.val(null);
                Investor.username.val(null);
                $('#SignUp').html('Register');

                if (asyncRequest.error != null) {
                    $('#SignUpNotification').html(asyncRequest.error).addClass("alert alert-warning");
                    setTimeout(() => {
                        $('#SignUpNotification').fadeOut(1000);
                    }, 5000)
                    $('#SignUpNotification').val(null).show();
                    return false;
                } else {
                    $('#SignUpNotification').html(asyncRequest.succces).addClass("alert alert-success");
                    setTimeout(() => {
                        $('#SignUpNotification').fadeOut(1000);
                        $('#SignUpNotification').val(null).show();
                        location.href = 'index.html';
                    }, 5000)
                }
            }
        })
    }
}

const Investor = {
    // fullName: $('#FullName'),
    // telephone: $('#Telephone'),
    // Question: $('#NewQuestion'),
    // Answer: $('#NewAnswer'),
    Email: {
        login: $('#login-form [name="email"]'),
        signUp: $('#sign-up-form #email')
    },
    username: $('#sign-up-form #username'),
    Password: {
        login: $('#login-form [name="password"]'),
        signUp: $('#sign-up-form #password'),
        verify: $('#sign-up-form #confirm-password')
    },
    errorMsg: null,
    /**null
     * Get the current date of the client system in YYYY-MM-DD format
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

const authenticate = {
    flag: false,
    JSON: 'JSON',
    type: { POST: 'POST', GET: 'GET' },
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