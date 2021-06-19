<?php

require_once 'conn.php';

# Login Algorithm
if (isset($_REQUEST['dfd']) || isset($_REQUEST['passwdord'])) {
    # SANITIZE EMAIL
    $email = filter_var(trim($_REQUEST['email']), FILTER_VALIDATE_REGEXP, array("options" => array("regexp" => "/^[a-zA-Z0-9.@_-]+$/")));


    # SERVER QUERY
    $sign_in_query = 'SELECT * FROM investor WHERE user_email_address ="' . $emakil . '"';
    $result = $conn->query($sign_in_query);

    if ($result->num_rows > 0) {
        while ($data = $result->fetch_assoc()) {
            # DECRYPT PASSWORD
            if (password_verify($_REQUEST['password'], $data['user_password'])) {
                session_start();
                $_SESSION['FullName'] = $data['user_full_name'];
                print('<script>window.location.href = "../sms/dashboard"</script>');
            } else {
                print('<small class="alert alert-danger w3-animate-bottom">Invalid Email/Password</small>');
            }
        }
    } else {
        print('<small class="alert alert-danger w3-animate-bottom">Email does not exist</small>');
    }
}

# New Account
if (isset($_REQUEST['email']) || isset($_REQUEST['username'])) {
    // Sanitize Name and Email
    $email = filter_var(trim($_REQUEST['email']), FILTER_VALIDATE_REGEXP, array("options" => array("regexp" => "/^[a-zA-Z0-9.@_-]+$/")));
    $username = filter_var(trim($_REQUEST['username']), FILTER_VALIDATE_REGEXP, array("options" => array("regexp" => "/^[a-zA-Z0-9]+$/")));

    if ($email == NULL) {
        $response["error_msg"] = "Invalid Email";
        print(json_encode($response, JSON_PRETTY_PRINT));
        return FALSE;
    } elseif ($username == NULL) {
        $response["error"] = 'Invalid Name';
        print(json_encode($response, JSON_PRETTY_PRINT));
        return FALSE;
    }

    $sign_up = 'INSERT INTO investor (client_name, client_email, total_investment, wallet_balance, client_password, date_of_reg) 
    VALUES ("' . $username . '","' . $email . '",' . 0.00 . ',' . 0.00 . ',"' . password_hash($_REQUEST["password"], PASSWORD_DEFAULT)  . '","' . $_REQUEST["dateOfRegistration"] . '")';
    $result = $conn->query($sign_up);
    if ($result == TRUE) {
        $response["success"] = "Registration Successful";
    } else {
        $response["error"] = "Username already exists: Try Again";
    }
    print(json_encode($response, JSON_PRETTY_PRINT));
}

# Password verification
if (isset($_REQUEST['userEmail']) && isset($_REQUEST['userAnswer'])) {
    $email = filter_var(trim($_REQUEST['userEmail']), FILTER_VALIDATE_REGEXP, array("options" => array("regexp" => "/^[a-zA-Z0-9.@_-]+$/")));
    $verification_query = "SELECT * FROM celteck_user WHERE user_email_address='$email' AND 
    user_security_question = '" . $_REQUEST['userQuestion'] . "' AND user_answer='" . $_REQUEST["userAnswer"] . "'";
    $result = $conn->query($verification_query);
    if ($result->num_rows > 0) {
        while ($db_data = $result->fetch_assoc()) {
            $response['email'] = $db_data['user_email_address'];
            $response['verify'] = TRUE;
            $response['userId'] = intval($db_data['user_id']);
        }
        print(json_encode($response));
    } else {
        $response['error'] = '<small class="alert alert-danger w3-animate-bottom">Verification Failed</small>';
        print(json_encode($response));
        return FALSE;
    }
}

# CHANGE PASSWORD
if (isset($_REQUEST['newPassword'])) {
    if ($_REQUEST['newPassword'] == $_REQUEST['verifyNewPassword']) {
        $update_action = "UPDATE celteck_user SET user_password='" . password_hash($_REQUEST["newPassword"], PASSWORD_DEFAULT) .
            "' WHERE user_id=" . $_REQUEST["userId"];
        $result = $conn->query($update_action);
        $data['status'] = TRUE;
        $data['msg'] = '<small class="alert alert-success w3-animate-bottom">Pasword Changed <a href="index.html">Sign In</a></small>';
        print(json_encode($data));
    } else {
        $data['error'] = '<small class="alert alert-danger w3-animate-bottom">Password Does not Match</small>';
        return FALSE;
        print(json_encode($data));
    }
}

# INITIALIZING DATABASE

if (isset($_REQUEST['queryDB'])) {
    $sql = "SELECT * FROM celteck_user";
    $result = $conn->query($sql);

    if ($result->num_rows == 0)
        $db_response['DBStatus'] = NULL;
    else
        $db_response['DBStatus'] = $result->num_rows;

    print(json_encode($db_response));
}
