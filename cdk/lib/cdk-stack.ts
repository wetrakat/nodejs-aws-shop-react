import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudf from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'SchoolBucketAnimals', {
      bucketName: 'new-course-rsschool-shop-animals',
    });
    const originAccessIdentity = new cloudf.OriginAccessIdentity(
      this,
      'PolicyBucketAnimals',
      {
        comment: bucket.bucketName,
      }
    );

    bucket.grantRead(originAccessIdentity);

    const cloudFront = new cloudf.Distribution(this, 'ReactShopDestribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    new deployment.BucketDeployment(this, 'ShopDeploymentnAnimal', {
      destinationBucket: bucket,
      sources: [deployment.Source.asset('../dist')],
      distribution: cloudFront,
      distributionPaths: ['/*'],
    });
  }
}
