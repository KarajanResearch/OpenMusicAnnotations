package oma

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

        // Create client
        super.client = AmazonS3ClientBuilder.standard()
            .withRegion(BUCKET_REGION.name)
            .withCredentials(AwsClientUtil.buildCredentials(super.config, super.serviceConfig))
            .withClientConfiguration(AwsClientUtil.buildClientConfiguration(super.config, super.serviceConfig))
            .build()
    }
}
