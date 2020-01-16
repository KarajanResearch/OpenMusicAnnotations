package org.karajanresearch.oma

import agorapulse.libs.awssdk.util.AwsClientUtil
import com.amazonaws.AmazonClientException
import com.amazonaws.regions.Region
import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.amazonaws.services.s3.model.AmazonS3Exception
import com.amazonaws.services.s3.model.ObjectMetadata
import grails.gorm.transactions.Transactional
import grails.plugin.awssdk.s3.AmazonS3Service

import javax.annotation.PostConstruct

import static com.amazonaws.SDKGlobalConfiguration.ACCESS_KEY_ENV_VAR

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

        println "create AWS client"
        println AwsClientUtil.buildCredentials(super.config, super.serviceConfig)
        println System.getenv(ACCESS_KEY_ENV_VAR)

        // Create client
        super.client = AmazonS3ClientBuilder.standard()
            .withRegion(BUCKET_REGION.name)
            .withCredentials(AwsClientUtil.buildCredentials(super.config, super.serviceConfig))
            .withClientConfiguration(AwsClientUtil.buildClientConfiguration(super.config, super.serviceConfig))
            .build()
    }

    /**
     *
     * @param bucketName
     * @param path
     * @param input
     * @param metadata
     * @return
     */
    String storeInputStream(String bucketName,
                            String path,
                            InputStream input,
                            ObjectMetadata metadata) {
        try {
            client.putObject(bucketName, path, input, metadata)
        } catch (AmazonS3Exception exception) {
            println 'An amazon S3 exception was caught while storing input stream' +  exception.message
            return ''
        } catch (AmazonClientException exception) {
            println 'An amazon S3 client exception was caught while storing input stream' +  exception.message
            return ''
        }

        buildAbsoluteUrl(bucketName, path)
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
