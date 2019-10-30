package org.karajanresearch.oma

import agorapulse.libs.awssdk.util.AwsClientUtil
import com.amazonaws.regions.Region
import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import grails.gorm.transactions.Transactional
import grails.plugin.awssdk.s3.AmazonS3Service

import javax.annotation.PostConstruct

@Transactional
class StorageBackendService extends AmazonS3Service {

    static final BUCKET_NAME = 'open-music-annotations-storage-backend'
    static final Region BUCKET_REGION = Region.getRegion(Regions.EU_CENTRAL_1)


    @PostConstruct
    def init() {
        println "initn"
        init(BUCKET_NAME)
    }

    /**
     * overriding properties and client creation
     * for a region that is different from default region application.yml
     * @throws Exception
     */
    void afterPropertiesSet() throws Exception {

        assert BUCKET_REGION?.isServiceSupported(super.SERVICE_NAME)
        https://opendistro.github.io/for-elasticsearch/?sc_icampaign=Adoption_Campaign_open-es-smdupdate-csi-082019&sc_ichannel=ha&sc_icontent=awssm-2777&sc_ioutcome=PaaS_Digital_Marketing&sc_iplace=signin&trk=ha_a131L0000057yaJQAQ~ha_awssm-2777&trkCampaign=open-es-smdupdate-csi-082019
        // Create client
        super.client = AmazonS3ClientBuilder.standard()
            .withRegion(BUCKET_REGION.name)
            .withCredentials(AwsClientUtil.buildCredentials(super.config, super.serviceConfig))
            .withClientConfiguration(AwsClientUtil.buildClientConfiguration(super.config, super.serviceConfig))
            .build()
    }


    def getS3Key(String url) {
        url = url.replace("https://s3.amazonaws.com/", "")
        def parts = url.tokenize("/")
        def keyPath = parts.subList(1, parts.size()).join("/")
        return keyPath
    }

    def getS3Bucket(String url) {
        url = url.replace("https://s3.amazonaws.com/", "")
        def parts = url.tokenize("/")
        url = parts[0]
        def bucket = url.tokenize(".")[0]
        return bucket
    }
}
