import { SpecReporter } from 'jasmine-spec-reporter';
import CustomReporter = jasmine.CustomReporter;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter((new SpecReporter() as unknown) as CustomReporter);