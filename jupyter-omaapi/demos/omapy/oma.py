
__author__ = "Martin Aigner"

import requests
import json
import pandas as pd
import numpy as np

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
        try:
            content = json.loads(response.content.decode())
        except:
            content = {"error": response}
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


    def get_tempo_chart(self):
        print(self.dictionary())
        annotations = self.dictionary()["annotations"]
        data_frame = pd.DataFrame(annotations)
        # using the head() function to show the first couple of records
        # data_frame.head()

        # this creates a true/false filter on the beatNumber
        one_beats = data_frame['beatNumber'] == 1
        # using this filter, we select only True rows from the data_frame
        one_beats_only = data_frame[one_beats]
        # one_beats_only.head()

        # add another column to the data frame.
        # how big is our data frame?
        # take one column and use shape to get the number of row

        column_shape = one_beats_only['id'].shape
        # use this shape with np.zeros() to create a column containing zeros
        # and apply this column to the data frame with title "barDuration"
        one_beats_only['barDuration'] = np.zeros(column_shape)
        # one_beats_only.head()

        # iterate the table to calculate the barDuration. skip the last row
        # because the last beat's duration cannot be calculated
        for row_index in range(column_shape[0] - 1):
            #current_bar_start = one_beats_only["momentOfPerception"][row_index]
            current_bar_start = one_beats_only.iloc[row_index, 3]
            next_bar_start = one_beats_only.iloc[row_index + 1, 3]
            duration = next_bar_start - current_bar_start
            #write back result
            one_beats_only.iloc[row_index, 4] = duration

        # one_beats_only.head()
        #%%
        # add another column for the inverse value.
        # this time using some numpy features.
        # search the web for numpy

        # "slice" the column with the barDuration and convert it to a numpy array
        durations = one_beats_only["barDuration"].to_numpy()
        tempos = np.reciprocal(durations)
        # add the tempos. np arrays can be added as columns
        # one_beats_only["barTempo"] = tempos
        # one_beats_only.head()
        #%%
        # plot the tempo curve
        # x and y axes can be numpy arrays too
        x_axis = one_beats_only["barNumber"].to_numpy()
        y_axis = tempos
        return (x_axis, y_axis)


class Recording(ApiObject):
    def __init__(self, id, oma_login):
        self.id = id
        self.objectName = "recording"
        self.oma_login = oma_login
        self.params = {"method": "get"}

    def get_annotation_sessions(self):
        sessions = ApiObject()
        sessions.params["method"] = "findBy"
        sessions.params["findBy"] = "recording"
        sessions.params["recording"] = self.id
        sessions.objectName = "annotation"
        sessions.id = 0
        sessions.oma_login = self.oma_login
        sessions.get()

        return sessions.dictionary()





class Composer(ApiObject):
    def __init__(self, id, oma_login):
        self.id = id
        self.objectName = "composer"
        self.oma_login = oma_login
        self.params = {"method": "get"}

