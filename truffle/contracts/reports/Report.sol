// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Report Framework
 * @notice Smart Contract developed for the Harmony One Round 2 Hackathon on Gitcoin
 * @dev On-Chain reporting of a single metric and its count defined by a key and a category.
 * It will store each in a bucket denoted by the {Report}-{getReportingPeriodFor} function,
 * which defines a bucket given a timestamp. The report is configured for weekly reporting,
 * with a week starting on Sunday. Override the {getReportingPeriodFor} to derive your own reporting period.
 *
 * Note Use the provided API to update the global report or the latest reports. When updating the latest
 * reports, the global report is also updated.
 * Designed as real-time reporting. A global report keeps track of overall accumulated values.
 *
 * Note no overflow has been added ... something to be mindful of
 *
 * @author victaphu
 */
contract Report is Ownable {
    // a report period represents a single report period start/end date
    // a sum/count for each report period is provided when updating
    // reports hold all the keyed reports for a given date range
    struct ReportPeriod {
        uint256 startRange;
        uint256 endRange;
        uint256 sum;
        uint256 count;
        bytes[] keys;
        mapping(bytes => ReportOverview) reports;
    }

    // a report overview represents the next level and represents one level
    // further of details. the focus of the report is presented as a key
    struct ReportOverview {
        uint256 sum;
        uint256 count;
        bytes[] categories;
        mapping(bytes => ReportItem) reportItems;
    }

    // reports can be further divided into report items which represent the
    // lowest level of reporting.
    struct ReportItem {
        uint256 sum;
        uint256 count;
    }

    mapping(address => bool) private _access;
    uint256 constant DAY_IN_SECONDS = 86400;

    // this represents a global overview of reports
    ReportPeriod private _overallReport;

    mapping(uint256 => ReportPeriod) private reports;

    /**
     * @dev return the latest report object using the latest timestamp to find the
     * report from reports mapping.
     *
     * @return period latest report using timestamp to derive the timeslot
     */
    function getLatestReportObject()
        internal
        view
        returns (ReportPeriod storage period)
    {
        period = reports[getLatestReportingPeriod()];
    }

    /**
     * @dev given a unix timestamp (in seconds) return the current weekday
     * note week 0 is sunday, week 6 is saturday
     *
     * @param timestamp unix timestamp in seconds (e.g. block.timestamp)
     * @return weekday the day of week between 0 and 6 (inclusive)
     */
    function getWeekday(uint256 timestamp) public pure returns (uint8 weekday) {
        weekday = uint8((timestamp / DAY_IN_SECONDS + 4) % 7);
    }

    /**
     * @dev this function will take a timestamp and normalise it to a value.
     * By default, reports are normalised to closest start of the week, so this
     * function will help generate weekly reports
     *
     * @param timestamp is the UNIX timestamp (in seconds) e.g. the block.timestamp
     */
    function getReportPeriodFor(uint256 timestamp)
        public
        view
        virtual
        returns (uint256 reportPeriod)
    {
        uint256 currentDOW = getWeekday(timestamp);
        timestamp = (timestamp - currentDOW * DAY_IN_SECONDS);
        timestamp = timestamp - timestamp % DAY_IN_SECONDS;
        reportPeriod = timestamp;
    }

    /**
     * @dev get the latest reporting period given the block timestamp. Return a normalised value
     * based on timestamp. By default we return normalised by week
     *
     * @return reportPeriod the normalised report period for the latest timestamp
     */
    function getLatestReportingPeriod()
        public
        view
        returns (uint256 reportPeriod)
    {
        return getReportPeriodFor(block.timestamp);
    }

    /**
     * @dev grant access to selected reporter. only the owner of the report object may assign reporters
     *
     * @param reporter the address of user/contract that may update this report
     */
    function grantAccess(address reporter) public onlyOwner {
        _access[reporter] = true;
    }

    /**
     * @dev revoke access for a selected reporter. only the owner of the report may revoke reporters
     *
     * @param reporter the address of the user/contract that we are revoking access
     */
    function revokeAccess(address reporter) public onlyOwner {
        _access[reporter] = false;
    }

    modifier accessible() {
        require(
            _access[msg.sender] || owner() == msg.sender,
            "Cannot access reporting function"
        );
        _;
    }

    /**
     * @dev update a report given the period and the value. If the period is 0, then
     * the global report is updated. The sum is increased by the supplied value and the
     * count is incremented by 1
     *
     * @param period is the normalised period that we want to update.
     * @param value is the value to be added
     */
    function updateReport(uint256 period, uint256 value) private {
        ReportPeriod storage latest;
        if (period == 0) {
            latest = _overallReport;
        } else {
            latest = getLatestReportObject();
        }
        latest.count += 1;
        latest.sum += value;
    }

    /**
     * @dev update a report given the period, key and the value. If the period is 0, then
     * the global report is updated. The sum is increased by the supplied value and the
     * count is incremented by 1. The key represents one additional dimension of data recorded
     *
     * @param period the normalised period that we want to update.
     * @param key the key dimension for this report
     * @param value the value to be added
     */
    function updateReport(
        uint256 period,
        bytes memory key,
        uint256 value
    ) private {
        updateReport(period, value);
        ReportPeriod storage latest;
        if (period == 0) {
            latest = _overallReport;
        } else {
            latest = getLatestReportObject();
        }
        ReportOverview storage overview = latest.reports[key];
        if (overview.count == 0) {
            latest.keys.push(key);
        }
        overview.count += 1;
        overview.sum += value;
    }

    /**
     * @dev update a report given the period, key and category and the value. If the period is 0, then
     * the global report is updated. The sum is increased by the supplied value and the
     * count is incremented by 1. The key and category can be used to capture more fine-grain data
     * note data is rolled up to the parent
     *
     * @param period the normalised period that we want to update.
     * @param key the key dimension for this report
     * @param category the category dimension for this report
     * @param value the value to be added
     */
    function updateReport(
        uint256 period,
        bytes memory key,
        bytes memory category,
        uint256 value
    ) private {
        updateReport(period, key, value);
        ReportPeriod storage latest;
        if (period == 0) {
            latest = _overallReport;
        } else {
            latest = getLatestReportObject();
        }
        ReportOverview storage overview = latest.reports[key];
        ReportItem storage item = overview.reportItems[category];

        if (item.count == 0) {
            overview.categories.push(category);
            overview.reportItems[category] = item;
        }
        item.count += 1;
        item.sum += value;
    }

    /**
     * @dev update the latest report, and update the global report for the running total
     *
     * @param value the value to be added
     */
    function updateLatestReport(uint256 value) external accessible {
        uint256 period = getLatestReportingPeriod();
        updateReport(period, value);
        updateReport(0, value); // update global report
    }

    /**
     * @dev update the latest report, and update the global report for the running total
     *
     * @param key the key dimension for this report
     * @param value the value to be added
     */
    function updateLatestReport(bytes memory key, uint256 value)
        external
        accessible
    {
        uint256 period = getLatestReportingPeriod();
        updateReport(period, key, value);
        updateReport(0, key, value); // update global report
    }

    /**
     * @dev update the latest report, and update the global report for the running total
     *
     * @param key the key dimension for this report
     * @param category the category dimension for this report
     * @param value the value to be added
     */
    function updateLatestReport(
        bytes memory key,
        bytes memory category,
        uint256 value
    ) external accessible {
        uint256 period = getLatestReportingPeriod();
        updateReport(period, key, category, value);
        updateReport(0, key, category, value); // update global report
    }

    /**
     * @dev update the global report, this should be used if there is no intention to
     * have the report tool manage the running totals
     *
     * @param value the value to be added
     */
    function updateGlobalReport(uint256 value) external accessible {
        updateReport(0, value);
    }

    /**
     * @dev update the global report, this should be used if there is no intention to
     * have the report tool manage the running totals
     *
     * @param key the key dimension for this report
     * @param value the value to be added
     */
    function updateGlobalReport(bytes memory key, uint256 value)
        external
        accessible
    {
        updateReport(0, key, value);
    }

    /**
     * @dev update the global report, this should be used if there is no intention to
     * have the report tool manage the running totals
     *
     * @param key the key dimension for this report
     * @param category the category dimension for this report
     * @param value the value to be added
     */
    function updateGlobalReport(
        bytes memory key,
        bytes memory category,
        uint256 value
    ) external accessible {
        updateReport(0, key, category, value);
    }

    /**
     * @dev get the report for a given period. supply 0 for the argument to get the global report
     * note returns data for the next level, use the keys to query further
     *
     * @param period the period for which we want to retrieve the data
     * @return sum current accumulated sum
     * @return count current total count for the overall report
     * @return sums all the sums that have been accumulated so far
     * @return counts all the counts that have been accumulated so far
     * @return keys a list of key dimensions. sums, counts and keys have same length and indexed accordingly
     */
    function getReportForPeriod(uint256 period)
        public
        view
        returns (
            uint256 sum,
            uint256 count,
            uint256[] memory sums,
            uint256[] memory counts,
            bytes[] memory keys
        )
    {
        ReportPeriod storage report;
        if (period == 0) {
            report = _overallReport;
        } else {
            report = reports[period];
        }

        sum = report.sum;
        count = report.count;
        keys = report.keys;

        uint256[] memory sumStorage = new uint256[](keys.length);
        uint256[] memory countStorage = new uint256[](keys.length);

        for (uint256 i = 0; i < keys.length; i++) {
            sumStorage[i] = report.reports[keys[i]].sum;
            countStorage[i] = report.reports[keys[i]].count;
        }

        sums = sumStorage;
        counts = countStorage;
    }

    /**
     * @dev get the report for a given period and key dimension. supply 0 for the argument to get the global report
     * note returns data for the next level, use the keys to query further
     *
     * @param period the period for which we want to retrieve the data
     * @param key the key dimension which we want to report on
     * @return sum current accumulated sum
     * @return count current total count for the overall report
     * @return sums all the sums that have been accumulated so far
     * @return counts all the counts that have been accumulated so far
     * @return keys a list of key dimensions. sums, counts and keys have same length and indexed accordingly
     */
    function getReportForPeriod(uint256 period, bytes memory key)
        public
        view
        returns (
            uint256 sum,
            uint256 count,
            uint256[] memory sums,
            uint256[] memory counts,
            bytes[] memory keys
        )
    {
        ReportPeriod storage report;
        if (period == 0) {
            report = _overallReport;
        } else {
            report = reports[period];
        }

        ReportOverview storage reportOverview = report.reports[key];
        sum = reportOverview.sum;
        count = reportOverview.count;
        keys = reportOverview.categories;

        uint256[] memory sumStorage = new uint256[](keys.length);
        uint256[] memory countStorage = new uint256[](keys.length);

        for (uint256 i = 0; i < keys.length; i++) {
            sumStorage[i] = reportOverview.reportItems[keys[i]].sum;
            countStorage[i] = reportOverview.reportItems[keys[i]].count;
        }

        sums = sumStorage;
        counts = countStorage;
    }

    /**
     * @dev get the report for a given period and key dimension. supply 0 for the argument to get the global report
     * note returns data for the next level, use the keys to query further
     *
     * @param period the period for which we want to retrieve the data
     * @param key the key dimension which we want to report on
     * @param category the category dimension which we want to report on
     * @return sum current accumulated sum
     * @return count current total count for the overall report
     */
    function getReportForPeriod(
        uint256 period,
        bytes memory key,
        bytes memory category
    ) public view returns (uint256 sum, uint256 count) {
        ReportPeriod storage report;
        if (period == 0) {
            report = _overallReport;
        } else {
            report = reports[period];
        }

        ReportItem storage item = report.reports[key].reportItems[category];
        sum = item.sum;
        count = item.count;
    }

    /**
     * @dev get the latest report at the highest level. includes key dimension breakdown
     * note returns data for the next level, use the keys to query further
     *
     * @return sum current accumulated sum
     * @return count current total count for the overall report
     * @return sums all the sums that have been accumulated so far
     * @return counts all the counts that have been accumulated so far
     * @return keys a list of key dimensions. sums, counts and keys have same length and indexed accordingly
     */
    function getLatestReport()
        public
        view
        returns (
            uint256 sum,
            uint256 count,
            uint256[] memory sums,
            uint256[] memory counts,
            bytes[] memory keys
        )
    {
        return getReportForPeriod(getLatestReportingPeriod());
    }

    /**
     * @dev get the latest report for a key dimension
     * note returns data for the next level, use the categories to query further
     *
     * @param key the key dimension which we want to report on
     * @return sum current accumulated sum
     * @return count current total count for the overall report
     * @return sums all the sums that have been accumulated so far
     * @return counts all the counts that have been accumulated so far
     * @return keys a list of key dimensions. sums, counts and keys have same length and indexed accordingly
     */
    function getLatestReport(bytes memory key)
        public
        view
        returns (
            uint256 sum,
            uint256 count,
            uint256[] memory sums,
            uint256[] memory counts,
            bytes[] memory keys
        )
    {
        return getReportForPeriod(getLatestReportingPeriod(), key);
    }

    /**
     * @dev get the latest report for a key and category dimension
     *
     * @param key the key dimension which we want to report on
     * @return sum current accumulated sum
     * @return count current total count for the overall report
     */
    function getLatestReport(bytes memory key, bytes memory category)
        public
        view
        returns (uint256 sum, uint256 count)
    {
        return getReportForPeriod(getLatestReportingPeriod(), key, category);
    }
}
