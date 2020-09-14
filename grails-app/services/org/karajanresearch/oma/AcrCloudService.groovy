package org.karajanresearch.oma

import org.karajanresearch.oma.music.DigitalAudio

import com.acrcloud.utils.ACRCloudRecognizer
import com.acrcloud.utils.ACRCloudExtrTool


class AcrCloudService {


    def fingerPrint(DigitalAudio digitalAudio) {


        def result = [errors: []]


        Map<String, Object> config = new HashMap<String, Object>();

        // replace "XXXXXXXX" with your project's host, access_key and access_secret
        config.put("host", "identify-eu-west-1.acrcloud.com");
        config.put("access_key", "a2e67691f9ca8338971c402d491381b7");
        config.put("access_secret", "mrSi2L0w9kn4CgnoBJLghhKTaJt6BBRcNf0iByk3");

        config.put("debug", true);
        config.put("timeout", 10); // seconds




        println System.properties["java.library.path"]


        ACRCloudRecognizer re = new ACRCloudRecognizer(config);

        result.message = re.recognizeByFile(digitalAudio.location, 0)


        ACRCloudExtrTool extrTool = new ACRCloudExtrTool()

        def fingerprint = extrTool.createFingerprintByFile(digitalAudio.location, 0, 10, false)

        def hash = fingerprint.encodeAsMD5()

        result.hash = hash


        result.fingerprintSize = fingerprint.size()



        return result
    }

}
