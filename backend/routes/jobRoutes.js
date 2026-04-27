import express from 'express';

const router = express.Router();

// @desc    Fetch jobs from JSearch API (RapidAPI) based on query and location
// @route   GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const { keyword } = req.query;
    
    // Construct the query for JSearch
    const location = req.query.location || 'India';
    let searchQuery = keyword ? keyword : 'Software Developer';
    searchQuery += ` in ${location}`;

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };

    const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=1&num_pages=1`, options);
    
    if (!response.ok) {
        console.error(`JSearch API error: ${response.status} ${response.statusText}`);
        throw new Error('Failed to fetch from JSearch API');
    }

    const json = await response.json();
    const jobs = json.data || [];

    // Return cleaned data
    let cleaned = jobs.map((job) => ({
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city ? `${job.job_city}, ${job.job_country}` : (job.job_is_remote ? 'Remote, India' : 'India'),
      applyLink: job.job_apply_link || job.job_google_link,
    }));

    // Fallback frontend filter
    if (location !== 'Global') {
      cleaned = cleaned.filter(job =>
        job.location && job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    res.json(cleaned);
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

export default router;
