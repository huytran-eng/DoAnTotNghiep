namespace LMS.BusinessLogic.DTOs
{
    public class DownloadStudyMaterialDTO
    {
        public byte[] FileBytes { get; set; }
        public string ContentType { get; set; }
        public string FileName { get; set; }
    }
}
