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
    "verify_certificate": True,
    "cache_dir": "omacache"
}




def login(endpoint, access_token, verify_certificate):
    """
    Authenticates to oma and sets the Authorization
    header field.
    :param endpoint:
    :param verify_certificate:
    :param access_token
    :return: http response
    """
    _endpoint["uri"] = endpoint
    _config["verify_certificate"] = verify_certificate
    _headers['Authorization'] = "Bearer " + access_token
    print(_headers['Authorization'])
    return _headers


def composer_add(params):
    params["method"] = "add"
    url = _endpoint["uri"] + _config["api_path"] + "composer"
    response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    return content

def composer_list(params):
    params["method"] = "list"
    url = _endpoint["uri"] + _config["api_path"] + "composer"
    response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    return content

def composer_find(params):
    params["method"] = "findBy"
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

def composition_list(params):
    params["method"] = "list"
    url = _endpoint["uri"] + _config["api_path"] + "composition"
    response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    return content

def composition_find(params):
    params["method"] = "findBy"
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


def interpretation_add_abstract_music_part(params, files):
    params["method"] = "addAbstractMusicPart"
    url = _endpoint["uri"] + _config["api_path"] + "interpretation"
    response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    
    if "error" in content:
        if content["error"] == "please provide a file":
            print("providing a amp file")
            ## TODO: at upload time, also do python based audio extraction and uploat as static results
            response = requests.post(
                url, headers=_headers, data=params, files=files, verify=_config["verify_certificate"])
            # response = requests.post(url, headers=_headers, data = params, _config["verify_certificate"])
            content = json.loads(response.content.decode())
    
    return content

# findByComposition
def interpretation_find(params):
    params["method"] = "find"
    # params["findBy"] = "composition"
    url = _endpoint["uri"] + _config["api_path"] + "interpretation"
    response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    
    if "error" in content:
        if content["error"] == "please provide a file":
            print("providing a file")
            ## TODO: at upload time, also do python based audio extraction and uploat as static results
            response = requests.post(
                url, headers=_headers, data=params, files=files, verify=_config["verify_certificate"])
            # response = requests.post(url, headers=_headers, data = params, _config["verify_certificate"])
            content = json.loads(response.content.decode())
    
    return content


def recording_add_image(params, files):
    params["method"] = "addImage"
    url = _endpoint["uri"] + _config["api_path"] + "recording"
    # response = requests.post(url, headers=_headers, data = params, files = files, _config["verify_certificate"])
    response = requests.post(
                url, headers=_headers, data=params, files=files, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    return content


def recording_add(params, files):
    params["method"] = "add"
    url = _endpoint["uri"] + _config["api_path"] + "recording"
    # response = requests.post(url, headers=_headers, data = params, files = files, _config["verify_certificate"])
    response = requests.post(
                url, headers=_headers, data=params, files=files, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    return content


def recording_get(params):
    params["method"] = "get"
    url = _endpoint["uri"] + _config["api_path"] + "recording"
    # response = requests.post(url, headers=_headers, data = params, files = files, _config["verify_certificate"])
    # upload without a file first. if recording exists, no upload necessary
    response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
    # first get the recording object
    content = json.loads(response.content.decode())
    return content
    # bytes in response.content
    
    # check cache
    
    # update cache
    
    # return recording object
    
    
def recording_get_audio(params):
    params["method"] = "getAudio"
    url = _endpoint["uri"] + _config["api_path"] + "recording"


    # bytes in response.content
    # TODO: get extension from response. all mp3 for not
    print("cache dir", _config["cache_dir"])
    output_file_name = _config["cache_dir"] + "/recording/" + str(params["recording"]) + "." + params["type"]
    # exists in cache?
    try:
        with open(output_file_name, "rb") as output_file:
            print("opened")
            return output_file
    except FileNotFoundError:
        print("not found")
        
        # response = requests.post(url, headers=_headers, data = params, files = files, _config["verify_certificate"])
        # upload without a file first. if recording exists, no upload necessary
        response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
        # first get the recording object
        print(response)
        with open(output_file_name, "wb") as output_file:
            print("creating")
            output_file.write(response.content)
            return output_file
            
    
    
    
    # check cache
    
    # update cache
    
    # return recording object
    

def session_add(params, files):
    params["method"] = "add"
    url = _endpoint["uri"] + _config["api_path"] + "session"
    response = requests.post(url, headers=_headers, data=params, files=files, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    return content


def annotation_find(params):
    params["method"] = "findBy"
    url = _endpoint["uri"] + _config["api_path"] + "annotation"
    response = requests.post(url, headers=_headers, data=params, verify=_config["verify_certificate"])
    content = json.loads(response.content.decode())
    return content

    
    