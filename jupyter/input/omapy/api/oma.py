from __future__ import print_function
import requests
import json

_headers = {
    'User-Agent': 'Bootstrap.py',
    'Authorization': ""
}
_endpoint = {
    "uri": ""
}

_config = {
    "api_path": "api/",
    "verify_certificate": True
}


def login(endpoint, username, password, verify_certificate):
    """
    Authenticates to oma and sets the Authorization
    header field.
    :param endpoint:
    :param verify_certificate:
    :param username: a valid username for oma
    :param password: the password
    :return: http response
    """
    _endpoint["uri"] = endpoint
    _config["verify_certificate"] = verify_certificate
    data = {
        'username': username,
        "password": password
    }
    url = _endpoint["uri"] + _config["api_path"] + "login"
    response = requests.post(url, json=data, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    _headers['Authorization'] = content['token_type'] + " " + content['access_token']
    return response


def composer_add(params):
    params["method"] = "add"
    url = _endpoint["uri"] + _config["api_path"] + "composer"
    response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    return content


def composition_add(params):
    params["method"] = "add"
    url = _endpoint["uri"] + _config["api_path"] + "composition"
    response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    return content


def interpretation_add(params):
    params["method"] = "add"
    url = _endpoint["uri"] + _config["api_path"] + "interpretation"
    response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    return content


def interpretation_add_abstract_music_part(params):
    params["method"] = "addAbstractMusicPart"
    url = _endpoint["uri"] + _config["api_path"] + "interpretation"
    response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    return content


def recording_add(params, files):
    params["method"] = "add"
    url = _endpoint["uri"] + _config["api_path"] + "recording"
    # response = requests.post(url, headers=_headers, data = params, files = files, _config["verify_certificate"])
    # upload without a file first. if recording exists, no upload necessary
    response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())

    if "error" in content:
        if content["error"] == "please provide a file":
            print("providing a file")
            response = requests.post(
                url, headers=_headers, data=params, files=files, verify=_config["verify_certificate"])
            # response = requests.post(url, headers=_headers, data = params, _config["verify_certificate"])
            content = json.loads(response.content.decode())

    return content


def session_add(params, files):
    params["method"] = "add"
    url = _endpoint["uri"] + _config["api_path"] + "session"
    response = requests.post(url, headers=_headers, data=params, files=files, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    return content
