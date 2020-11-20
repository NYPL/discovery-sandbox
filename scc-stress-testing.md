# Stress Testing SCC

This document proposes how we may estimate the traffic increase to SCC when it's positioned as the default Research Catalog and how we may assess it's ability to handle that increase.

## Throughput & Scaling Audit

For each high priority component, we'll want to answer the following:
 * What is the current provisioning and how does it scale?
 * What depenedent services are likely to constrain/invalidate scaling?
 * Top N categories of page/resource
 * Average hits per day/hour/minute
 * Peak hits per day/hour/minute
 * How might we scale CPU/memory/storage (i.e. automatic/manual, what's the ceiling & cost)
 * Given anticipated traffic increase, what ceiling(s) will we hit?
 * What optimizations are possible (e.g. offloading responsibilities to other services like S3/CF, gzip, field mapping optimization, caching, contract modifications)
 * Average execution time to process a single event (Lambda functions)

For any component for which we have concerns, we'll want to actually examine the component under load. For services, building Test Plans in [JMeter](#jmeter) may be enough. For consumers we may estimate capacity by looking at average execution time.

## Establishing a baseline

We'll look at the historical traffic to the Legacy Catalog (LC) to estimate the traffic increase to the SCC. We'll need to determine:
 * Top N categories of page/resource
   - Use Google Analytics to determine what percentage of pageviews belong to what categories of page (e.g. Search, Bib, Account, Home/Landing). This can be found under Behavior > Site Content > All Pages > keyword search on url patterns. Analyze 1 year to date.
 * Average hits per day/hour/minute
   - Use Google Analytics to fetch number of pageviews over 1 year to date. Divide by numbers of days/hours
 * Peak hits per day/hour
   - Use Google Analytics to visually identify peak pageview hour and day over 1 year of traffic (Audience > Overview > Select pageviews)
 * Average response time
   - Use Google Analytics to determine time to load page and dependencies (Behavior > Site Speed > Overview)
 * Average unique visitors per day

We establish target benchmarks as follows:
 - **Traffic increase**: We estimate traffic increase as the ratio of LC unique users to SCC unique users over the same 1 year time period
 - **Page response time**: SCC should not exceed response time for equivalent category page in LC
 - **Pageview capacity**: SCC should withstand a sustained (30+min) increase in pageviews consistent with the "Traffic increase" defined above (emulated through JMeter), satisfying:
   - 99% or more requests should respond successfully, with appropriate payload and a non-error HTTP status
   - 99% or more requests should satisfy "SCC page response time" benchmark defined above.
 - **Hold request capacity**: SCC hold request pipeline should withstand target hold request capacity, satisfying:
   - 100% of requests should be processed correctly (or, for those that fail, they should fail due to an issue outside our control)
   - Hold requests should be processed quickly; the hold request pipeline should not exhibit an increasing backlog under target load.

## High Priority Components

The following components are the most important candidates for testing because their performance directly impacts patron experience:

### discovery-front-end

The SCC app itself is the most important target of our testing

#### 1. Establish benchmark

For SCC, determine:
 * Top N categories of page/resource
   - Use Google Analytics on both properties to determine what percentage of pageviews belong to what categories of page (e.g. Search, Bib, Account, Home/Landing). Behavior > Site Content > All Pages > keyword search on url patterns. Analyze 1 year to date.
 * Average hits per day/hour/minute
   - Use Google Analytics to fetch number of pageviews over 1 year to date. Divide by numbers of days/hours
 * Peak hits per day/hour
   - Use Google Analytics to visually identify peak pageview hour and day over 1 year of traffic (Audience > Overview > Select pageviews)
 * Average response time
   - Use Google Analytics to determine time to load page and dependencies (Behavior > Site Speed > Overview)
 * Average unique visitors per day
 * Average and peak holds per day/hour broken down by own/partner items
   - Query hold-request-service db

#### 2. Test SCC

Examine loadbalancer setup of QA SCC to verify autoscale policy. Build a Test Plan in JMeter to fire a bunch of traffic at DiscoveryFrontEnd, which conforms to the content breakdown of the LC. Observe SCC LB behavior. Scale up traffic to match the peak LC rate. Sustain traffic for a significant period (say, 30m). Observe error rate and response time. Note CPU/memory/IO loads.

#### 3. Analyze results

Identify points at which performance degraded (i.e. response time exceeded average LC response time). Attempt to identify failure causes:
 * Dependent service failures?
 * Scaling policy?
 * CPU/memory/IO constraints?

#### 4. Try things

Attempt to adjust/address issues found. For example:
 * Change scaling policy
 * Change Web worker instance characteristics
 * Consider app optimizations like caching, CDNs

After making changes, repeat from step 2.

### discovery-api

Examine loadbalancer setup of QA DiscoveryAPI to verify autoscale policy. Set up Test Plan in JMeter , which targets the DiscoveryAPI using endpoints that reflect browsing behaviors in the LC. Observe LB behavior. Scale up traffic to match the peak LC rate. Sustain traffic for a significant period (say, 30m). Observe error rate and response time. Note CPU/memory/IO loads.

Identify failure points:
 * Elasticsearch?
 * Scaling policy?
 * CPU/memory/IO constraints?

### discovery-api elastic search

Based on testing performed on discovery-api, examine failure points of Elasticsearch. It may be necessary to set up automated query load testing using JMeter to isolate ES testing. Examine Elasticsearch setup to determine whether or not there are opportunities to improve performance at the domain level. Examine slow queries to identify opportunties to restructure queries or adjust field mappings for performance improvements.

### shep-api

ShepAPI tuning is kind of its own investigation.

Consider dusting off/updating this script https://github.com/NYPL/subject-headings-explorer-poc/pull/164 to test out optimizations.

Given the specialized expertise of tuning Neo4J, may need to look into graceful degradation techniques: As Neo4J health diminishes, we should strive to avoid impacting SCC core functionality. We may quietly/subtley disable shep-api dependent features based on realtime health checks.

## Med priority components

The following components would ideally get some attention to ensure they don't reveal themselves as having unanticipated performance/capacity ceilings:

### patron-eligibility-service

Given that the PatronEligibilityService is called upon by the SCC at the start of placing a hold, the PatronEligibitilityService should capably handle an increase in traffic commensurate with SCC's anticipated unique user increase.

Examine service to determine what services are called upon and under what circumstances. Attempt to identify dependent services (i.e. Sierra api) that are likely to be expensive, particularly under load. Consider scripting a flood of patron-eligibility queries to examine success rate.

### hold-request-service

Verify HoldRequest database is provisioned with capacity to accomodate estimated influx of hold requests (unique user increase multipled by current rate of hold requests) for at least a year.

Analyze historical performance of service in processing holds. Should be able to sample durations using Cloudwatch Insights queries (See [Querying Logs Insights](#querying-logs-insights). Verify the cost of calling the SCSB API implies a max throughput that accomodates the anticipated traffic increase.

### hold-request-consumer

Analyze historical performance of consumer in processing holds for SCC- and SCSB-originating hold requests. May use a combination of random log sampling and [CW Logs Insights queries](#querying-logs-insights). Verify the cost of calling the SCSB API implies a max throughput that accomodates the anticipated traffic increase.

### recap-hold-request-consumer

Analyze historical performance of consumer in processing holds for NYPL and partner items (which trigger use of the Sierra API and NCIP, respectively. Need to understand the time required to process a single hold of each to estimate max throughput. Apply that to estimated hold request influx.

## Low priority components

The following components are a part of SCC but are not a major concern - either because they're already battle tested or just don't really do much.

### recap-hold-request-service

Verify RecapHoldRequest database is provisioned with capacity to accomodate estimated influx of hold requests (unique user increase multipled by current rate of hold requests) for at least a year.

Analyze historical performance of service in processing holds from SCSB. Verify the average duration implies a max throughput that accomodates the anticipated traffic increase.

### item-service

Determine throughput as a function of average execution time. Verify anticipated traffic agrees with estimated throughput.

### sierra-api

Sierra API use is mostly asyncronous to patron activity, so is not an anticipated bottleneck. Will will likely stress Sierra API hold creation through testing the RecapHoldRequestConsumer.

### SCSB API

We may choose to stress test the `sharedCollection/itemAvailabilityStatus` endpoint of the SCSB API because it's used heavily in SCC search results. We should examine the traffic generated from a single results page in SCC and build a JMeter Test Plan that emulates that traffic multiplied by the anticipated traffic increase. This will verify whether the SCSB API endpoint will be a bottleneck on its own.

SCSB API hold request endpoint usage is not anticipated to be a bottleneck, but we may want to script placing a big batch of hold requests (physical and edd) to ascertain the SCSB API's capacity.

# Appendix

## JMeter

This has been helpful: https://jmeter.apache.org/usermanual/index.html

Starting up JMeter:

```
./bin/jmeter
```

From this (https://jmeter.apache.org/usermanual/build-web-test-plan.html ) I built a simple two page test plan for QA SCC in [./test-plans/scc.jmx](test-plans/scc.jmx)

To run the test plan via cli:

```
bin/jmeter -n -t test-plans/scc.jmx -l scc-log.jtl
```

To generate a "Dashboard" set of graphs:

```
./bin/jmeter -g scc-log.jtl -o scc-dashboard
```

## Querying Logs Insights

### How long are functions running?

The following [query in CW Insights](https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:logs-insights$3FqueryDetail$3D$257E$2528end$257E$25272020-11-18T04*3a59*3a59.000Z$257Estart$257E$25272020-11-18T01*3a19*3a00.000Z$257EtimeType$257E$2527ABSOLUTE$257Etz$257E$2527Local$257EeditorString$257E$2527filter*20*40type*20*3d*20*22REPORT*22*0a*7c*20fields*20*40requestId*2c*20*40billedDuration*0a*7c*20sort*20by*20*40billedDuration*20desc$257EisLiveTail$257Efalse$257EqueryId$257E$2527146b31c4-cec8-422b-9b09-d172579e3ac7$257Esource$257E$2528$257E$2527*2faws*2flambda*2fDiscoveryStorePoster-qa$2529$2529) gives you how long functions ran for ("billedDuration"):

```
filter @type = "REPORT"
| fields @requestId, @billedDuration
| sort by @billedDuration desc
```
