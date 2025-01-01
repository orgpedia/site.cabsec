import sys
from urllib.parse import urlparse


def replace_image_urls(file_path):
    try:
        # Read the file
        with open(file_path, 'r') as file:
            lines = file.readlines()

        # Process each line and replace URLs
        updated_lines = []
        for line in lines:
            if "https://sansad.in" in line:
                start_idx = line.find("https://sansad.in")
                url = line[start_idx:].split()[0]  # Extract the URL
                parsed_url = urlparse(url)
                image_filename = parsed_url.path.split('/')[-1]
                new_line = line.replace(url, f"../i/ds/{image_filename}")
                updated_lines.append(new_line)
            else:
                updated_lines.append(line)

        # Write the updated content back to the file
        with open(file_path, 'w') as file:
            file.writelines(updated_lines)

        print(f"Updated image URLs in {file_path}")

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python replace_image_urls.py <file_path>")
        sys.exit(1)

    file_path = sys.argv[1]
    replace_image_urls(file_path)
