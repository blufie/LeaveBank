<?php

//including the required files
require_once '../include/DbOperation.php';
require '.././libs/Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

/* *
 * URL: http://localhost/StudentApp/v1/createstudent
 * Parameters: name, email, password
 * Method: POST
 * */
$app->post('/createstudent', function () use ($app) {
    verifyRequiredParams(array('name', 'email', 'password', 'dept', 'employeeNo', 'leaveBalance', 'leaveStatus'));
    $response = array();
    $name = $app->request->post('name');
    $email = $app->request->post('email');
    $password = $app->request->post('password');
    $dept = $app->request->post('dept');
    $employeeNo = $app->request->post('employeeNo');
    $leaveBalance = $app->request->post('leaveBalance');
    $leaveStatus  = $app->request->post('leaveStatus');
    $db = new DbOperation();
    $res = $db->createStudent($name, $email, $password, $dept, $employeeNo, $leaveBalance, $leaveStatus );
    if ($res == 0) {
        $response["error"] = false;
        $response["message"] = "You are successfully registered";
        echoResponse(201, $response);
    } else if ($res == 1) {
        $response["error"] = true;
        $response["message"] = "Oops! An error occurred while registereing";
        echoResponse(200, $response);
    } else if ($res == 2) {
        $response["error"] = true;
        $response["message"] = "Sorry, this student  already existed";
        echoResponse(200, $response);
    }
});

/* *
 * URL: http://localhost/StudentApp/v1/studentlogin
 * Parameters: email, password
 * Method: POST
 * */
$app->post('/studentlogin', function () use ($app) {
    verifyRequiredParams(array('email', 'password'));
    $email = $app->request->post('email');
    $password = $app->request->post('password');
    $db = new DbOperation();
    $response = array();
    if ($db->studentLogin($email, $password)) {
        $student = $db->getStudent($email);
        $response['error'] = false;
        $response['id'] = $student['id'];
        $response['name'] = $student['name'];
        $response['email'] = $student['email'];
        $response['dept'] = $student['dept'];
        $response['employeeNo'] = $student['employeeNo']; 
        $response['leaveBalance'] = $student['leaveBalance']; 
        $response['leaveStatus'] = $student['leaveStatus']; 
        $response['apikey'] = $student['api_key'];
    } else {
        $response['error'] = true;
        $response['message'] = "Invalid email or password";
    }
    echoResponse(200, $response);
});

/* *
 * URL: http://localhost/StudentApp/v1/createfaculty
 * Parameters: name, email, password, subject
 * Method: POST
 * */
$app->post('/createfaculty', function () use ($app) {
    verifyRequiredParams(array('name', 'email', 'password', 'subject'));
    $name = $app->request->post('name');
    $email = $app->request->post('email');
    $password = $app->request->post('password');
    $subject = $app->request->post('subject');

    $db = new DbOperation();
    $response = array();

    $res = $db->createFaculty($name, $email, $password, $subject);
    if ($res == 0) {
        $response["error"] = false;
        $response["message"] = "You are successfully registered";
        echoResponse(201, $response);
    } else if ($res == 1) {
        $response["error"] = true;
        $response["message"] = "Oops! An error occurred while registereing";
        echoResponse(200, $response);
    } else if ($res == 2) {
        $response["error"] = true;
        $response["message"] = "Sorry, this faculty already existed";
        echoResponse(200, $response);
    }
});


/* *
 * URL: http://localhost/StudentApp/v1/facultylogin
 * Parameters: email, password
 * Method: POST
 * */

$app->post('/facultylogin', function() use ($app){
    verifyRequiredParams(array('email','password'));
    $email = $app->request->post('email');
    $password = $app->request->post('password');

    $db = new DbOperation();

    $response = array();

    if($db->facultyLogin($email,$password)){
        $faculty = $db->getFaculty($email);
        $response['error'] = false;
        $response['id'] = $faculty['id'];
        $response['name'] = $faculty['name'];
        $response['email'] = $faculty['email'];
        $response['subject'] = $faculty['subject'];
        $response['apikey'] = $faculty['api_key'];
    }else{
        $response['error'] = true;
        $response['message'] = "Invalid email or password";
    }

    echoResponse(200,$response);
});


/* *
 * URL: http://localhost/StudentApp/v1/createassignment
 * Parameters: name, details, facultyid, studentid
 * Method: POST
 * */
$app->post('/createassignment',function() use ($app){
    verifyRequiredParams(array('name','details','facultyid','studentid'));

    $name = $app->request->post('name');
    $details = $app->request->post('details');
    $facultyid = $app->request->post('facultyid');
    $studentid = $app->request->post('studentid');

    $db = new DbOperation();

    $response = array();

    if($db->createAssignment($name,$details,$facultyid,$studentid)){
        $response['error'] = false;
        $response['message'] = "Assignment created successfully";
    }else{
        $response['error'] = true;
        $response['message'] = "Could not create assignment";
    }

    echoResponse(200,$response);

});

/* *
 * URL: http://localhost/StudentApp/v1/assignments/<student_id>
 * Parameters: none
 * Authorization: Put API Key in Request Header
 * Method: GET
 * */
$app->get('/assignments/:id', 'authenticateStudent', function($student_id) use ($app){
    $db = new DbOperation();
    $result = $db->getAssignments($student_id);
    $response = array();
    $response['error'] = false;
    $response['assignments'] = array();
    while($row = $result->fetch_assoc()){
        $temp = array();
        $temp['id']=$row['id'];
        $temp['name'] = $row['name'];
        $temp['details'] = $row['details'];
        $temp['completed'] = $row['completed'];
        $temp['faculty']= $db->getFacultyName($row['faculties_id']);
        array_push($response['assignments'],$temp);
    }
    echoResponse(200,$response);
});


/* *
 * URL: http://localhost/StudentApp/v1/submitassignment/<assignment_id>
 * Parameters: none
 * Authorization: Put API Key in Request Header
 * Method: PUT
 * */

$app->put('/submitassignment/:id', 'authenticateFaculty', function($assignment_id) use ($app){
    $db = new DbOperation();
    $result = $db->updateAssignment($assignment_id);
    $response = array();
    if($result){
        $response['error'] = false;
        $response['message'] = "Assignment submitted successfully";
    }else{
        $response['error'] = true;
        $response['message'] = "Could not submit assignment";
    }
    echoResponse(200,$response);
});


/* *
 * URL: http://localhost/StudentApp/v1/biodatas
 * Parameters: none
 * Authorization: Put API Key in Request Header
 * Method: GET
 * */
$app->get('/biodatas', 'authenticateFaculty', function() use ($app){
    $db = new DbOperation();
    $result = $db->getAllbiodatas();
    $response = array();
    $response['error'] = false;
    $response['biodatas'] = array();

    while($row = $result->fetch_assoc()){
        $temp = array();
        $temp['id'] = $row['id'];
        $temp['name'] = $row['name'];
        $temp['email'] = $row['email'];
        $temp['dept'] = $row['dept'];
        $temp['employeeNo'] = $row['employeeNo'];
        $temp['leaveBalance'] = $row['leaveBalance'];
        $temp['leaveStatus'] = $row['leaveStatus'];
        array_push($response['biodatas'],$temp);
    }

    echoResponse(200,$response);
});

function echoResponse($status_code, $response)
{
    $app = \Slim\Slim::getInstance();
    $app->status($status_code);
    $app->contentType('application/json');
    echo json_encode($response);
}


function verifyRequiredParams($required_fields)
{
    $error = false;
    $error_fields = "";
    $request_params = $_REQUEST;

    if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
        $app = \Slim\Slim::getInstance();
        parse_str($app->request()->getBody(), $request_params);
    }

    foreach ($required_fields as $field) {
        if (!isset($request_params[$field]) || strlen(trim($request_params[$field])) <= 0) {
            $error = true;
            $error_fields .= $field . ', ';
        }
    }

    if ($error) {
        $response = array();
        $app = \Slim\Slim::getInstance();
        $response["error"] = true;
        $response["message"] = 'Required field(s) ' . substr($error_fields, 0, -2) . ' is missing or empty';
        echoResponse(400, $response);
        $app->stop();
    }
}

function authenticateStudent(\Slim\Route $route)
{
    $headers = apache_request_headers();
    $response = array();
    $app = \Slim\Slim::getInstance();

    if (isset($headers['Authorization'])) {
        $db = new DbOperation();
        $api_key = $headers['Authorization'];
        if (!$db->isValidStudent($api_key)) {
            $response["error"] = true;
            $response["message"] = "Access Denied. Invalid Api key";
            echoResponse(401, $response);
            $app->stop();
        }
    } else {
        $response["error"] = true;
        $response["message"] = "Api key is misssing";
        echoResponse(400, $response);
        $app->stop();
    }
}


function authenticateFaculty(\Slim\Route $route)
{
    $headers = apache_request_headers();
    $response = array();
    $app = \Slim\Slim::getInstance();
    if (isset($headers['Authorization'])) {
        $db = new DbOperation();
        $api_key = $headers['Authorization'];
        if (!$db->isValidFaculty($api_key)) {
            $response["error"] = true;
            $response["message"] = "Access Denied. Invalid Api key";
            echoResponse(401, $response);
            $app->stop();
        }
    } else {
        $response["error"] = true;
        $response["message"] = "Api key is misssing";
        echoResponse(400, $response);
        $app->stop();
    }
}

$app->run();