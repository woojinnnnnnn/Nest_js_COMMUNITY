import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

const firebaseProvider = {
      provide : 'FIREBASE_APP',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
            const firebaseConfig = {
            type: configService.get<string>('FIREBASE_SDK_ACCOUNT'),
            project_id : configService.get<string>('FIREBASE_PROJECT_ID'),
            private_key_id: configService.get<string>('FIREBASE_PRIVATE_KEY_ID'),
            private_key: configService.get<string>('FIREBASE_PRIVATE_KEY'),
            client_email: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
            client_id: configService.get<string>('FIREBASE_CLIENT_ID'),
            auth_uri: configService.get<string>('FIREBASE_AUTH_URI'),
            token_uri: configService.get<string>('FIREBASE_TOKEN_URI'),
            auth_provider_x509_cert_url: configService.get<string>('FIREBASE_AUTH_CERT_URL'),
            client_x509_cert_url: configService.get<string>('FIREBASE_CLIENT_CERT_URL'),
            universe_domain: configService.get<string>('FIREBASE_UNIVERSE_DOMAIN')
            } as admin.ServiceAccount;

            return admin.initializeApp({
                  credential: admin.credential.cert(firebaseConfig),
                  databaseURL: `https://${configService.get<string>('FIREBASE_PROJECT_ID')}.firebaseio.com`,
                  storageBucket: configService.get<string>('FIREBASE_SDK_STORAGE_BUCKET')
            })
      }
}

@Module({
      imports: [ConfigModule],
      providers: [firebaseProvider],
      exports: [],
})
export class FirebaseModule {}
