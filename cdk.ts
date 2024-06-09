import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'Stack', {
  env: { region: 'eu-west-1' },
});

const bucket = new s3.Bucket(stack, 'S3Bucket', {
  bucketName: 'animalshopforschool',
});

const originAccessIdentity = new cf.OriginAccessIdentity(
  stack,
  'ReactShopBucketShop',
  {
    comment: bucket.bucketName,
  }
);

bucket.grantRead(originAccessIdentity);


new deployment.BucketDeployment(stack, 'DeployReactAnimalsShop', {
  destinationBucket: bucket,
  sources: [deployment.Source.asset('./dist')],
  distributionPaths: ['/*'],
});


