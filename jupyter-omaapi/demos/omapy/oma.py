
__author__ = "Martin Aigner"

import requests
import json


class Login:
    def __init__(self, endpoint, access_token, verify_certificate=True):
        self.endpoint = endpoint
        self.access_token = access_token
        self.verify_certificate = verify_certificate
        self.headers = {
            'User-Agent': 'oma.py',
            'Authorization': "Bearer " + access_token
        }
        self.config = {
            "api_path": "api/",
            "cache_dir": "omacache"
        }

    def recording(self, id):
        r = Recording(id, self)
        r.get()
        return r

    def composer(self, id):
        c = Composer(id, self)
        c.get()
        return c

    def annotation_session(self, id):
        s = AnnotationSession(id, self)
        s.get()
        return s


class ApiObject:
    def __init__(self):
        self.__data_cache = None
        self.oma_login = None
        self.params = {}

    def get(self):
        self.params[self.objectName] = self.id
        url = self.oma_login.endpoint + self.oma_login.config["api_path"] + self.objectName
        response = requests.post(url, headers=self.oma_login.headers, data=self.params, verify=self.oma_login.verify_certificate)
        # print(response.content.decode())
        content = json.loads(response.content.decode())
        self.__data_cache = content

    def dictionary(self):
        if self.__data_cache is None:
            self.get()
        return self.__data_cache


class AnnotationSession(ApiObject):
    def __init__(self, id, oma_login):
        self.id = id
        self.objectName = "session"
        self.oma_login = oma_login
        self.params = {"method": "get"}


class Recording(ApiObject):
    def __init__(self, id, oma_login):
        self.id = id
        self.objectName = "recording"
        self.oma_login = oma_login
        self.params = {"method": "get"}

    def get_annotation_sessions(self):
        session = ApiObject()
        session.params["method"] = "findBy"
        session.params["findBy"] = "recording"
        session.params["recording"] = self.id
        session.objectName = "annotation"
        session.id = 0
        session.oma_login = self.oma_login
        session.get()
        return session


class Composer(ApiObject):
    def __init__(self, id, oma_login):
        self.id = id
        self.objectName = "composer"
        self.oma_login = oma_login
        self.params = {"method": "get"}

